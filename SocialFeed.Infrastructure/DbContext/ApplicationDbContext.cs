using Microsoft.EntityFrameworkCore;
using SocialFeed.Domain;
using System.Collections.Generic;

namespace SocialFeed.Infrastructure
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
    }
}
