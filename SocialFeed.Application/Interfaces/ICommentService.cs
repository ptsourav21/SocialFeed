namespace SocialFeed.Application
{
    public interface ICommentService
    {
        Task<CommentResponseDto> CreateCommentAsync(Guid userId, CreateCommentDTO request);
        Task ToggleLikeAsync(Guid userId, Guid commentId);
        Task<List<string>> GetCommentLikersAsync(Guid commentId);
    }
}