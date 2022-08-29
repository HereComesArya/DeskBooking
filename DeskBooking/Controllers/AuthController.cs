using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.AspNetCore.Mvc;

namespace DeskBooking.Controllers
{
    public class AuthController : ControllerBase
    {
        [Microsoft.AspNetCore.Mvc.HttpGet("/api/signin-google")]
        public IActionResult SignInGoogle(string returnUrl = "/")
        {
            return Challenge(new AuthenticationProperties
            {
                RedirectUri = returnUrl
            }, GoogleDefaults.AuthenticationScheme);
        }   

        [Microsoft.AspNetCore.Mvc.HttpGet("api/signin-ms")]
        public IActionResult SignInMicrosoft(string returnUrl = "/")
        {
            return Challenge(new AuthenticationProperties
            {  
                RedirectUri = returnUrl
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
