using System.Security.Claims;

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
        return user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value ?? user.Identity?.Name;
    }
    public static string? GetLastName(this ClaimsPrincipal user)
    {
        return user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value ?? "";
    }
    public static string? GetEmail(this ClaimsPrincipal user)
    {
        return user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
    }
}
