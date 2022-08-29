using System.Security.Claims;

namespace DeskBooking.Extensions;
public static class UserExtensions
{
    public static string? GetGoogleIdentitfier(this ClaimsPrincipal user)
    {
        return user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
    }

    public static string? GetUsername(this ClaimsPrincipal user)
    {
        return user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value ?? user.Identity?.Name;
    }
}
