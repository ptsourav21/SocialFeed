using SocialFeed.Domain;

namespace SocialFeed.Application
{
    public interface IUserService
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> CreateUserAsync(User user);
    }
}
