namespace SocialFeed.Application
{
    public class CreateCommentDTO
    {
        public Guid PostId { get; set; }
        public Guid? ParentCommentId { get; set; } // Null if direct comment
        public string Content { get; set; } = string.Empty;
    }
}