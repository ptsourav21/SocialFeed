using System.Xml.Linq;

namespace SocialFeed.Domain
{
    public class Post : BaseObject
    {
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsPublic { get; set; } = true;
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<PostLike> Likes { get; set; } = new List<PostLike>();
    }
}