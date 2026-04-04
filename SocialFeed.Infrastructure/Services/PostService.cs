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

            return posts.Select(p => {
                // 1. Get all comments for this post
                var allComments = p.Comments.ToList();

                // 2. Map every comment to a DTO first
                var commentDtos = allComments.Select(c => new CommentResponseDto
                {
                    Id = c.ID.ToString(),
                    Content = c.Content,
                    CreatedAt = c.CreatedTime,
                    // Use c.User here (the commenter), NOT p.User (the post author)
                    AuthorName = c.User.FirstName + " " + c.User.LastName,
                    AuthorId = c.UserId.ToString(),
                    LikesCount = 0, // Wire up later
                    HasLiked = false,
                    Replies = new List<CommentResponseDto>() // Initialize the list
                }).ToList();

                // 3. Build the Tree
                var rootComments = new List<CommentResponseDto>();
                var commentLookup = commentDtos.ToDictionary(c => c.Id);

                foreach (var c in allComments)
                {
                    var dto = commentLookup[c.ID.ToString()];

                    if (c.ParentCommentId == null)
                    {
                        // This is a top-level comment
                        rootComments.Add(dto);
                    }
                    else
                    {
                        // This is a reply! Find its parent and add it to the 'Replies' list
                        var parentIdStr = c.ParentCommentId.ToString();
                        if (commentLookup.TryGetValue(parentIdStr, out var parentDto))
                        {
                            parentDto.Replies ??= new List<CommentResponseDto>();
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
                    Comments = rootComments, // Only return the Top-Level (Roots)
                    CommentsCount = allComments.Count,
                    IsPublic = p.IsPublic
                };
            }).ToList();
        }

        // Helper method to recursively map comments and their replies
        private CommentResponseDto MapComment(Comment c, IEnumerable<Comment> allComments, Guid currentUserId)
        {
            return new CommentResponseDto
            {
                Id = c.ID.ToString(),
                Content = c.Content,
                CreatedAt = c.CreatedTime,
                // BUG FIX: Use c.User, not p.User (p.User is the Post author!)
                AuthorName = c.User.FirstName + " " + c.User.LastName,
                AuthorId = c.UserId.ToString(),
                LikesCount = 0, // Wire up later
                HasLiked = false,
                // 2. Find all comments that have THIS comment as their parent
                Replies = allComments
                    .Where(r => r.ParentCommentId == c.ID)
                    .Select(r => MapComment(r, allComments, currentUserId))
                    .ToList()
            };
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