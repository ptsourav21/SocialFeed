using Microsoft.AspNetCore.Mvc;

namespace SocialFeed.API
{
    public class AuthController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
