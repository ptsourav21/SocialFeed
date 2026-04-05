using SocialFeed.Domain;

namespace SocialFeed.Domain
{
    
    public class PostLike : BaseObject
    {
        public Guid UserId { get; set; }
        public virtual User User { get; set; } = null!;
        public Guid PostId { get; set; }
        public virtual Post Post { get; set; } = null!;
    }
}