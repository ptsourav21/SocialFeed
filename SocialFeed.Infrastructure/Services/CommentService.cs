using SocialFeed.Application;
using SocialFeed.Domain;

namespace SocialFeed.Infrastructure
{
    public class CommentService : ICommentService
    {
        private readonly CommentDA _commentDA;

        public CommentService(CommentDA commentDA)
        {
            _commentDA = commentDA;
        }

        public async Task CreateCommentAsync(Guid userId, CreateCommentDTO request)
        {
            var comment = new Comment
            {
                UserId = userId,
                PostId = request.PostId,
                // If this is a reply to another comment, this will be populated. If null, it's a root comment.
                ParentCommentId = request.ParentCommentId,
                Content = request.Content,
                CreatedBy = userId
            };

            await _commentDA.InsertCommentAsync(comment);
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
                await _commentDA.AddLikeAsync(new CommentLike
                {
                    UserId = userId,
                    CommentId = commentId
                });
            }
        }
    }
}