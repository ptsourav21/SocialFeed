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

            // This is where the magic happens:
            return posts.Select(p => new PostResponseDTO
            {
                Id = p.ID,
                AuthorName = p.User.FirstName +" "+ p.User.LastName,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedTime,
                LikesCount = p.Likes.Count,
                HasLiked = p.Likes.Any(l => l.UserId == currentUserId),

                // --- CRITICAL PART START ---
                Comments = p.Comments.Select(c => new CommentResponseDto
                {
                    Id = c.ID.ToString(),
                    Content = c.Content,
                    CreatedAt = c.CreatedTime,
                    // If p.Comments.ThenInclude(c => c.User) worked, this won't be null!
                    AuthorName = p.User.FirstName + " " + p.User.LastName,
                    AuthorId = c.UserId.ToString(),
                    LikesCount = 0, // Wire up later
                    HasLiked = false
                }).ToList(),
                // --- CRITICAL PART END ---

                CommentsCount = p.Comments.Count,
                IsPublic = p.IsPublic
            }).ToList();
        }

        public async Task<PostResponseDTO> CreatePostAsync(Guid userId, CreatePostDTO request)
        {
            var post = new Post
            {
                UserId = userId,
                Content = request.Content,
                ImageUrl = request.ImageUrl,
                IsPublic = request.IsPublic,
                CreatedTime = DateTime.UtcNow,
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