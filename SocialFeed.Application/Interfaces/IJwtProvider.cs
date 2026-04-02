using SocialFeed.Domain;

namespace SocialFeed.Application;

public interface IJwtProvider
{
    string Generate(User user);
}