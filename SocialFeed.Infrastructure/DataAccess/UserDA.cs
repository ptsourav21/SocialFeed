using Microsoft.EntityFrameworkCore;
using SocialFeed.Domain;

namespace SocialFeed.Infrastructure
{
    public class UserDA
    {
        private readonly ApplicationDbContext _context;

        public UserDA(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.ID == id && u.Status == EnumStatus.Active);
        }
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .AsNoTracking()
                .SingleOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> InsertUserAsync(User user)
        {
            user.CreatedTime = DateTime.UtcNow;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            user.CreatedBy = user.ID;
            await _context.SaveChangesAsync();

            return user;
        }
    }
}
