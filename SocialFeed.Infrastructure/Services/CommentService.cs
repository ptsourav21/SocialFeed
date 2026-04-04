using SocialFeed.Domain; // Your Comment entity
using SocialFeed.Infrastructure; // Your CommentDA

namespace SocialFeed.Application.Services
{
    public class CommentService : ICommentService
    {
        private readonly CommentDA _commentDA;
        private readonly ApplicationDbContext _context; // Only using this to fetch the User's name!

        // Inject your DA here!
        public CommentService(CommentDA commentDA, ApplicationDbContext context)
        {
            _commentDA = commentDA;
            _context = context;
        }

        public async Task<CommentResponseDto> CreateCommentAsync(Guid userId, CreateCommentDTO request)
        {
            var user = await _context.Users.FindAsync(userId);

            var newComment = new Comment
            {
                ID = Guid.NewGuid(),
                PostId = request.PostId,
                UserId = userId,
                Content = request.Content,
                ParentCommentId = (Guid)request.ParentCommentId,
                CreatedTime = DateTime.UtcNow,
                Status = EnumStatus.Active
            };

            await _commentDA.InsertCommentAsync(newComment);

            return new CommentResponseDto
            {
                Id = newComment.ID.ToString(),
                Content = newComment.Content,
                CreatedAt = newComment.CreatedTime,
                AuthorName = user.FirstName + " " + user.LastName,
                AuthorId = user.ID.ToString(),
                LikesCount = 0,
                HasLiked = false,
                Replies = new List<CommentResponseDto>() // New replies start empty
            };
        }
        // I went ahead and mapped out your ToggleLike using your DA as well!
        public async Task ToggleLikeAsync(Guid userId, Guid commentId)
        {
            // 1. Check if the like already exists using your DA
            var existingLike = await _commentDA.GetCommentLikeAsync(userId, commentId);

            if (existingLike != null)
            {
                // 2. If it exists, they are "unliking" it. Remove it using your DA.
                await _commentDA.RemoveLikeAsync(existingLike);
            }
            else
            {
                // 3. If it doesn't exist, they are "liking" it. Add it using your DA.
                var newLike = new CommentLike
                {
                    UserId = userId,
                    CommentId = commentId
                };
                await _commentDA.AddLikeAsync(newLike);
            }
        }
    }
}