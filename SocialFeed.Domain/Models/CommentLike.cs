namespace SocialFeed.Domain
{
    public class CommentLike : BaseObject
    {
        public Guid UserId { get; set; }
        public virtual User User { get; set; } = null!;
        public Guid CommentId { get; set; }
        public virtual Comment Comment { get; set; } = null!;

    }
}
