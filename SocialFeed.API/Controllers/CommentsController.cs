using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialFeed.Application;
using System.Security.Claims;

namespace SocialFeed.API
{
    [Authorize] // Locked down. Must have a JWT token to comment!
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly ILogger<CommentsController> _logger;

        public CommentsController(ICommentService commentService, ILogger<CommentsController> logger)
        {
            _commentService = commentService;
            _logger = logger;
        }

        private Guid GetCurrentUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.Parse(userIdString!);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDTO request)
        {
            try
            {
                var userId = GetCurrentUserId();

                if (request.ParentCommentId.HasValue)
                    _logger.LogInformation("User {UserId} replying to comment {ParentId}", userId, request.ParentCommentId);
                else
                    _logger.LogInformation("User {UserId} commenting on post {PostId}", userId, request.PostId);

                var result = await _commentService.CreateCommentAsync(userId, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create comment for post {PostId}.", request.PostId);
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Failed to create comment." });
            }
        }

        [HttpPost("{commentId}/like")]
        public async Task<IActionResult> ToggleLike(Guid commentId)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _commentService.ToggleLikeAsync(userId, commentId);

                _logger.LogInformation("User {UserId} toggled like on comment {CommentId}.", userId, commentId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to toggle like on comment {CommentId}.", commentId);
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Failed to process like." });
            }
        }
    }
}