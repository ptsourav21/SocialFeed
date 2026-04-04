namespace SocialFeed.Application
{
    public interface IPostService
    {
        Task<IEnumerable<PostResponseDTO>> GetFeedAsync(Guid currentUserId);
        Task<PostResponseDTO> CreatePostAsync(Guid userId, CreatePostDTO request);
        Task ToggleLikeAsync(Guid userId, Guid postId);
    }
}