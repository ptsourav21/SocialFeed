using Microsoft.EntityFrameworkCore;
using SocialFeed.Domain;

namespace SocialFeed.Infrastructure
{
    public class CommentDA
    {
        private readonly ApplicationDbContext _context;

        public CommentDA(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Comment> InsertCommentAsync(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task<CommentLike?> GetCommentLikeAsync(Guid userId, Guid commentId)
        {
            return await _context.CommentLikes
                .FirstOrDefaultAsync(l => l.UserId == userId && l.CommentId == commentId);
        }

        public async Task AddLikeAsync(CommentLike like)
        {
            _context.CommentLikes.Add(like);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveLikeAsync(CommentLike like)
        {
            _context.CommentLikes.Remove(like);
            await _context.SaveChangesAsync();
        }
    }
}