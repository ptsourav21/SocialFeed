using SocialFeed.Application;
using SocialFeed.Domain;

namespace SocialFeed.Infrastructure
{
    public class PostService : IPostService
    {
        private readonly PostDA _postDA;
        private readonly UserDA _userDA; // Need this to get Author Name

        public PostService(PostDA postDA, UserDA userDA)
        {
            _postDA = postDA;
            _userDA = userDA;
        }

        public async Task<IEnumerable<PostResponseDTO>> GetFeedAsync(Guid currentUserId)
        {
            var posts = await _postDA.GetFeedPostsAsync(currentUserId);

            return posts.Select(p => new PostResponseDTO
            {
                Id = p.ID,
                UserId = p.UserId,
                AuthorName = $"{p.User.FirstName} {p.User.LastName}",
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedTime,
                LikesCount = p.Likes.Count,
                CommentsCount = p.Comments.Count,
                IsPublic = p.IsPublic
            });
        }

        public async Task<PostResponseDTO> CreatePostAsync(Guid userId, CreatePostDTO request)
        {
            var post = new Post
            {
                UserId = userId,
                Content = request.Content,
                ImageUrl = request.ImageUrl,
                IsPublic = request.IsPublic,
                CreatedBy = userId
            };

            var createdPost = await _postDA.InsertPostAsync(post);
            // In a real scenario, you'd fetch the user to return the author name immediately

            return new PostResponseDTO
            {
                Id = createdPost.ID,
                UserId = createdPost.UserId,
                Content = createdPost.Content,
                ImageUrl = createdPost.ImageUrl,
                CreatedAt = createdPost.CreatedTime,
                IsPublic = createdPost.IsPublic,
                LikesCount = 0,
                CommentsCount = 0
            };
        }

        public async Task ToggleLikeAsync(Guid userId, Guid postId)
        {
            var existingLike = await _postDA.GetPostLikeAsync(userId, postId);

            if (existingLike != null)
                await _postDA.RemoveLikeAsync(existingLike);
            else
                await _postDA.AddLikeAsync(new PostLike { UserId = userId, PostId = postId });
        }
    }
}