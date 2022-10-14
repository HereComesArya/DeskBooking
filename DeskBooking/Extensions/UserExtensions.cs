using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Security.Principal;

namespace DeskBooking.Extensions;
public static class UserExtensions
{
    public static string? GetOauthIdentifier(this ClaimsPrincipal user)
    {
        return user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
    }
    public static string? GetUserId(this ClaimsPrincipal user)
    {
        return user?.Claims.FirstOrDefault(c=> c.Type == "UserId").Value;
        //return user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
    }
    public static string? GetFirstName(this ClaimsPrincipal user)
    {
        return user?.Claims.FirstOrDefault(c => c.Type == "DbFirstName")?.Value ??
            user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value ?? user.Identity?.Name;
    }
    public static string? GetLastName(this ClaimsPrincipal user)
    {
        return user?.Claims.FirstOrDefault(c => c.Type == "DbLastName")?.Value ??
            user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value ?? "";
    }
    public static string? GetEmail(this ClaimsPrincipal user)
    {
        return user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
    }
    public static bool IsAdmin(this ClaimsPrincipal user)
    {
        return user?.Claims.FirstOrDefault(c => c.Type == "Auth") != null ? true : false;
    }


    public async static void AddUpdateClaim(this ClaimsPrincipal user, string key, string value, HttpContext context)
    {
        var identity = user.Identity as ClaimsIdentity;
        if (identity == null)
            return;
        // check for existing claim and remove it
        var existingClaim = identity.FindFirst(key);
        if (existingClaim != null)
            identity.RemoveClaim(existingClaim);

        // add new claim
        identity.AddClaim(new Claim(key, value));      
        await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, user);
    }
}
