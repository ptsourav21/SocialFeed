using SocialFeed.Domain; 
using SocialFeed.Infrastructure; 

namespace SocialFeed.Application.Services
{
    public class CommentService : ICommentService
    {
        private readonly CommentDA _commentDA;
        private readonly ApplicationDbContext _context; 

        
        public CommentService(CommentDA commentDA, ApplicationDbContext context)
        {
            _commentDA = commentDA;
            _context = context;
        }

        public async Task<CommentResponseDto> CreateCommentAsync(Guid userId, CreateCommentDTO request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");

            var newComment = new Comment
            {
                ID = Guid.NewGuid(),
                PostId = request.PostId,
                UserId = userId,
                Content = request.Content,
                ParentCommentId = request.ParentCommentId.HasValue ? request.ParentCommentId.Value : null,
                CreatedTime = DateTime.UtcNow,
                Status = EnumStatus.Active
            };

            await _commentDA.InsertCommentAsync(newComment);

            return new CommentResponseDto
            {
                Id = newComment.ID.ToString(),
                Content = newComment.Content,
                CreatedAt = newComment.CreatedTime,
                AuthorName = $"{user.FirstName} {user.LastName}",
                AuthorId = user.ID.ToString(),
                LikesCount = 0,
                HasLiked = false,
                Replies = new List<CommentResponseDto>()
            };
        }
        public async Task ToggleLikeAsync(Guid userId, Guid commentId)
        {
          
            var existingLike = await _commentDA.GetCommentLikeAsync(userId, commentId);

            if (existingLike != null)
            {
               
                await _commentDA.RemoveLikeAsync(existingLike);
            }
            else
            {
                
                var newLike = new CommentLike
                {
                    UserId = userId,
                    CommentId = commentId
                };
                await _commentDA.AddLikeAsync(newLike);
            }
        }
        public async Task<List<string>> GetCommentLikersAsync(Guid commentId)
        {
            return await _commentDA.GetCommentLikersAsync(commentId);
        }
    }
}