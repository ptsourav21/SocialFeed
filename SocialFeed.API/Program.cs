using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Serilog;
using System.Text;
using System.Threading.RateLimiting;
using SocialFeed.Application;
using SocialFeed.Infrastructure;

#region 1. Logger Configuration (Serilog)
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("Logs/socialfeed-log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
#endregion

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

try
{
    Log.Information("Starting up the Secure SocialFeed API...");

    #region 2. Security Configuration
    // A. CORS Policy 
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("FrontendPolicy", policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });

    builder.Services.AddRateLimiter(options =>
    {
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

        options.AddFixedWindowLimiter("GlobalLimit", opt =>
        {
            opt.Window = TimeSpan.FromSeconds(10);
            opt.PermitLimit = 100;
        });

        options.AddFixedWindowLimiter("AuthLimit", opt =>
        {
            opt.Window = TimeSpan.FromMinutes(1);
            opt.PermitLimit = 5;
        });
    });

    builder.Services.AddAntiforgery(options =>
    {
        options.HeaderName = "X-XSRF-TOKEN";
    });
    #endregion

    #region 3. Database & Secrets Configuration
    // Decrypt the secure strings from appsettings.json
    var encryptedDbConnection = builder.Configuration.GetConnectionString("DefaultConnection");
    var decryptedDbConnection = EncryptionHelper.Decrypt(encryptedDbConnection!);

    var encryptedJwtSecret = builder.Configuration["Jwt:Secret"];
    var decryptedJwtSecret = EncryptionHelper.Decrypt(encryptedJwtSecret!);

    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(decryptedDbConnection));
    #endregion

    #region 4. Dependency Injection
    builder.Services.AddScoped<UserDA>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IJwtProvider, JwtProvider>();
    #endregion

    #region 5. Authentication Configuration
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(decryptedJwtSecret))
            };
        });
    #endregion

    #region 6. OpenAPI & Controllers
    builder.Services.AddControllers();

    // Native .NET OpenAPI Generator
    builder.Services.AddOpenApi();
    #endregion

    var app = builder.Build();

    #region 7. HTTP Request Pipeline (Middleware)
    if (app.Environment.IsDevelopment())
    {
        // Generate the raw OpenAPI JSON document
        app.MapOpenApi();

        // Serve the modern Scalar interactive UI
        app.MapScalarApiReference();
    }
    else
    {
        // Enforce Strict Transport Security in Production
        app.UseHsts();
    }

    app.UseHttpsRedirection();

    // Global Security Headers Middleware
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
        context.Response.Headers.Append("X-Frame-Options", "DENY");
        context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
        context.Response.Headers.Append("Content-Security-Policy", "default-src 'self';");

        await next();
    });

    app.UseCors("FrontendPolicy");
    app.UseRateLimiter();

    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();
    #endregion

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "The application failed to start correctly.");
}
finally
{
    Log.CloseAndFlush();
}