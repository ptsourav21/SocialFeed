using Microsoft.EntityFrameworkCore;
using SocialFeed.Domain;

namespace SocialFeed.Infrastructure
{
    public class PostDA
    {
        private readonly ApplicationDbContext _context;
        public PostDA(ApplicationDbContext context) { _context = context; }

        public async Task<List<Post>> GetFeedPostsAsync(Guid currentUserId)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Where(p => p.IsPublic || p.UserId == currentUserId)
                .OrderByDescending(p => p.CreatedTime)
                .ToListAsync();
        }

        public async Task<Post> InsertPostAsync(Post post)
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<PostLike?> GetPostLikeAsync(Guid userId, Guid postId)
        {
            return await _context.PostLikes.FirstOrDefaultAsync(l => l.UserId == userId && l.PostId == postId);
        }

        public async Task AddLikeAsync(PostLike like)
        {
            _context.PostLikes.Add(like);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveLikeAsync(PostLike like)
        {
            _context.PostLikes.Remove(like);
            await _context.SaveChangesAsync();
        }
    }
}