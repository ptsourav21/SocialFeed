using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SocialFeed.Application;
using SocialFeed.Domain;

namespace SocialFeed.API
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("AuthLimit")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtProvider _jwtProvider;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IUserService userService,
            IJwtProvider jwtProvider,
            ILogger<AuthController> logger)
        {
            _userService = userService;
            _jwtProvider = jwtProvider;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO request)
        {
            try
            {
                _logger.LogInformation("Registration attempt started for email: {Email}", request.Email);

                var existingUser = await _userService.GetUserByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    _logger.LogWarning("Registration failed. Email {Email} is already in use.", request.Email);
                    return BadRequest(new { Message = "Email is already in use." });
                }

                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                var newUser = new User
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    PasswordHash = passwordHash
                };

                var createdUser = await _userService.CreateUserAsync(newUser);
                string token = _jwtProvider.Generate(createdUser);

                _logger.LogInformation("User {UserId} registered successfully.", createdUser.ID);

                var response = new AuthResponseDTO
                {
                    Token = token,
                    UserId = createdUser.ID,
                    FirstName = createdUser.FirstName
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred during registration for {Email}", request.Email);
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "An unexpected error occurred. Please try again later." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            try
            {
                _logger.LogInformation("Login attempt for email: {Email}", request.Email);

                var user = await _userService.GetUserByEmailAsync(request.Email);
                if (user == null)
                {
                    _logger.LogWarning("Login failed. User not found for email: {Email}", request.Email);
                    return Unauthorized(new { Message = "Invalid email or password." });
                }

                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
                if (!isPasswordValid)
                {
                    _logger.LogWarning("Login failed. Invalid password for email: {Email}", request.Email);
                    return Unauthorized(new { Message = "Invalid email or password." });
                }

                string token = _jwtProvider.Generate(user);

                _logger.LogInformation("User {UserId} logged in successfully.", user.ID);

                var response = new AuthResponseDTO
                {
                    Token = token,
                    UserId = user.ID,
                    FirstName = user.FirstName
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred during login for {Email}", request.Email);
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "An unexpected error occurred. Please try again later." });
            }
        }
    }
}
