using SocialFeed.Application;
using SocialFeed.Domain;

namespace SocialFeed.Infrastructure
{
    public class UserService : IUserService
    {
        private readonly UserDA _userDA;

        public UserService(UserDA userDA)
        {
            _userDA = userDA;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userDA.GetUserByEmailAsync(email);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            return await _userDA.InsertUserAsync(user);
        }
    }
}
