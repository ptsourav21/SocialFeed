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

            // --- 1. POST CONFIGURATION ---
            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasOne(p => p.User)
                      .WithMany(u => u.Posts)
                      .HasForeignKey(p => p.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // --- 2. COMMENT CONFIGURATION ---
            modelBuilder.Entity<Comment>(entity =>
            {
                // Post -> Comment
                entity.HasOne(c => c.Post)
                      .WithMany(p => p.Comments)
                      .HasForeignKey(c => c.PostId)
                      .OnDelete(DeleteBehavior.Cascade);

                // User -> Comment
                entity.HasOne(c => c.User)
                      .WithMany(u => u.Comments)
                      .HasForeignKey(c => c.UserId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Parent -> Replies
                entity.HasOne(c => c.ParentComment)
                      .WithMany(c => c.Replies)
                      .HasForeignKey(c => c.ParentCommentId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // --- 3. POST LIKE (Working with BaseObject) ---
            modelBuilder.Entity<PostLike>(entity =>
            {
                entity.HasKey(pl => pl.ID);

                // Ensure a user can only like a post ONCE
                entity.HasIndex(pl => new { pl.UserId, pl.PostId }).IsUnique();

                entity.HasOne(pl => pl.Post)
                      .WithMany(p => p.Likes)
                      .HasForeignKey(pl => pl.PostId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pl => pl.User)
                      .WithMany(u => u.PostLikes)
                      .HasForeignKey(pl => pl.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // --- 4. COMMENT LIKE  ---
            modelBuilder.Entity<CommentLike>(entity =>
            {
                entity.HasKey(cl => cl.ID);

                // Ensure a user can only like a comment ONCE
                entity.HasIndex(cl => new { cl.UserId, cl.CommentId }).IsUnique();

                entity.HasOne(cl => cl.Comment)
                      .WithMany(c => c.CommentLikes)
                      .HasForeignKey(cl => cl.CommentId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(cl => cl.User)
                      .WithMany(u => u.CommentLikes)
                      .HasForeignKey(cl => cl.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}