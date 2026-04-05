namespace SocialFeed.Application
{
    public class CreatePostDTO
    {
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsPublic { get; set; } = true;
    }

    public class PostResponseDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
        public bool IsPublic { get; set; }
        public List<CommentResponseDto> Comments { get; set; } = new();
        public bool HasLiked { get; set; }
    }
}