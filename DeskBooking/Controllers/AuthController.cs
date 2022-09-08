using DeskBooking.Data;
using DeskBooking.Extensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.AspNetCore.Mvc;

namespace DeskBooking.Controllers
{
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;

        public AuthController(DataContext context)
        {
            _context = context;
        }
        [Microsoft.AspNetCore.Mvc.HttpGet("/api/signin-google")]
        public IActionResult SignInGoogle(string returnUrl = "/")
        {
            ChallengeResult challenge =  Challenge(new AuthenticationProperties
            {
                RedirectUri = $"/api/adduser?returnUrl={returnUrl}"
            }, GoogleDefaults.AuthenticationScheme);
            return challenge;
        }   

        [Microsoft.AspNetCore.Mvc.HttpGet("api/signin-ms")]
        public IActionResult SignInMicrosoft(string returnUrl = "/")
        {
            return Challenge(new AuthenticationProperties
            {  
                RedirectUri = $"/api/adduser?returnUrl={returnUrl}"
            },MicrosoftAccountDefaults.AuthenticationScheme );
        }
        [Microsoft.AspNetCore.Mvc.HttpPost("/api/signout")]
        public async Task<IActionResult> SignoutAsync()
        {
            await HttpContext.SignOutAsync();
            return Ok();
        }
    }
}
