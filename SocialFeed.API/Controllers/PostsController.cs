using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialFeed.Application;
using System.Security.Claims;

namespace SocialFeed.API
{
    [Authorize] // This whole controller requires the user to be logged in!
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;
        private readonly ILogger<PostsController> _logger;

        public PostsController(IPostService postService, ILogger<PostsController> logger)
        {
            _postService = postService;
            _logger = logger;
        }

        // Helper method to extract the logged-in user's Guid from the JWT Token
        private Guid GetCurrentUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.Parse(userIdString!);
        }

        [HttpGet]
        public async Task<IActionResult> GetFeed()
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogInformation("Fetching feed for user {UserId}", userId);

                var posts = await _postService.GetFeedAsync(userId);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve feed.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Failed to load feed." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDTO request)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogInformation("User {UserId} creating a new post.", userId);

                var post = await _postService.CreatePostAsync(userId, request);
                return Ok(post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create post.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Failed to create post." });
            }
        }

        [HttpPost("{postId}/like")]
        public async Task<IActionResult> ToggleLike(Guid postId)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _postService.ToggleLikeAsync(userId, postId);

                _logger.LogInformation("User {UserId} toggled like on post {PostId}.", userId, postId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to toggle like on post {PostId}.", postId);
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Failed to process like." });
            }
        }
    }
}