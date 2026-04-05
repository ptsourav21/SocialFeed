using SocialFeed.Application;
using SocialFeed.Domain;

namespace SocialFeed.Infrastructure
{
    public class PostService : IPostService
    {
        private readonly PostDA _postDA;
        private readonly UserDA _userDA;

        public PostService(PostDA postDA, UserDA userDA)
        {
            _postDA = postDA;
            _userDA = userDA;
        }

        public async Task<IEnumerable<PostResponseDTO>> GetFeedAsync(Guid currentUserId)
        {
            var posts = await _postDA.GetFeedPostsAsync(currentUserId);

            return posts.Select(p => {
                var allComments = p.Comments.ToList();

                var commentDtos = allComments.Select(c => new CommentResponseDto
                {
                    Id = c.ID.ToString(),
                    Content = c.Content,
                    CreatedAt = c.CreatedTime,
                    AuthorName = c.User.FirstName + " " + c.User.LastName,
                    AuthorId = c.UserId.ToString(),
                    LikesCount = c.CommentLikes?.Count ?? 0,
                    HasLiked = c.CommentLikes?.Any(l => l.UserId == currentUserId) ?? false,
                    Replies = new List<CommentResponseDto>()
                }).ToList();

                // 2. Build the Tree
                var rootComments = new List<CommentResponseDto>();
                var commentLookup = commentDtos.ToDictionary(c => c.Id);

                foreach (var c in allComments)
                {
                    var dto = commentLookup[c.ID.ToString()];

                    if (c.ParentCommentId == null)
                    {
                        rootComments.Add(dto);
                    }
                    else
                    {
                        var parentIdStr = c.ParentCommentId.ToString();
                        if (commentLookup.TryGetValue(parentIdStr, out var parentDto))
                        {
                            parentDto.Replies.Add(dto);
                        }
                    }
                }

                return new PostResponseDTO
                {
                    Id = p.ID,
                    UserId = p.UserId,
                    AuthorName = p.User.FirstName + " " + p.User.LastName,
                    Content = p.Content,
                    ImageUrl = p.ImageUrl,
                    CreatedAt = p.CreatedTime,
                    LikesCount = p.Likes.Count,
                    HasLiked = p.Likes.Any(l => l.UserId == currentUserId),
                    Comments = rootComments.OrderByDescending(c => c.CreatedAt).ToList(),
                    CommentsCount = allComments.Count,
                    IsPublic = p.IsPublic
                };
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
            var user = await _userDA.GetUserByIdAsync(userId);
            var createdPost = await _postDA.InsertPostAsync(post);

            return new PostResponseDTO
            {
                Id = createdPost.ID,
                UserId = createdPost.UserId,
                Content = createdPost.Content,
                ImageUrl = createdPost.ImageUrl,
                CreatedAt = createdPost.CreatedTime,
                IsPublic = createdPost.IsPublic,
                AuthorName = user.FirstName + " " + user.LastName,
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

        public async Task<List<string>> GetPostLikersAsync(Guid postId)
        {
            return await _postDA.GetPostLikersAsync(postId);
        }
    }
}