using Microsoft.EntityFrameworkCore;
using SocialFeed.Domain;

namespace SocialFeed.Infrastructure
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<CommentLike> CommentLikes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // PostLike Composite Key & Cascade Rules
            modelBuilder.Entity<PostLike>().HasKey(pl => new { pl.UserId, pl.PostId });
            modelBuilder.Entity<PostLike>()
                .HasOne(pl => pl.Post).WithMany(p => p.Likes).HasForeignKey(pl => pl.PostId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<PostLike>()
                .HasOne(pl => pl.User).WithMany(u => u.PostLikes).HasForeignKey(pl => pl.UserId).OnDelete(DeleteBehavior.Restrict);

            // CommentLike Composite Key & Cascade Rules
            modelBuilder.Entity<CommentLike>().HasKey(cl => new { cl.UserId, cl.CommentId });
            modelBuilder.Entity<CommentLike>()
                .HasOne(cl => cl.Comment).WithMany(c => c.Likes).HasForeignKey(cl => cl.CommentId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<CommentLike>()
                .HasOne(cl => cl.User).WithMany(u => u.CommentLikes).HasForeignKey(cl => cl.UserId).OnDelete(DeleteBehavior.Restrict);

            // Comment Replies
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.ParentComment).WithMany(c => c.Replies).HasForeignKey(c => c.ParentCommentId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}