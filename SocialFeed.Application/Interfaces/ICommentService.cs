namespace SocialFeed.Application
{
    public interface ICommentService
    {
        Task CreateCommentAsync(Guid userId, CreateCommentDTO request);
        Task ToggleLikeAsync(Guid userId, Guid commentId);
    }
}