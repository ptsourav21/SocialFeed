namespace SocialFeed.Application
{
    public class AuthResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
    }
}
