namespace SocialFeed.Application
{
    public class CreateCommentDTO
    {
        public Guid PostId { get; set; }
        public Guid? ParentCommentId { get; set; } // Null if direct comment
        public string Content { get; set; } = string.Empty;
    }
    public class CommentResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string AuthorId { get; set; } = string.Empty;
        public int LikesCount { get; set; }
        public bool HasLiked { get; set; }

        public List<CommentResponseDto>? Replies { get; set; }
    }
}