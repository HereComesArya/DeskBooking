using DeskBooking.Data;
using DeskBooking.Extensions;
using DeskBooking.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace DeskBooking.Auth.Endpoints
{
    public class AddUserEndpoint : EndpointWithoutRequest
    {
        private readonly DataContext _context;

        public AddUserEndpoint(DataContext context)
        {
            _context = context;
        }
        public override void Configure()
        {
            Get("/api/adduser");
            Summary(b => b.Description = "Creates a new user");
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            var redirectUrl = Query<string>("returnUrl") ?? "/";
            string curUserId;
            var email = User.GetEmail();
            //var firstName = User.GetFirstName();
            //var lastName = User.GetLastName();
            string firstName = "", lastName = "";
            var userFound = _context.Users.Where(u => u.Email == email).FirstOrDefault();
            
            if (userFound == null)
            {
                firstName = User.GetFirstName()!;
                lastName = User.GetLastName() ?? "";
                Models.User user = new() { Email = email!, FirstName = firstName!, LastName = lastName! };
                _context.Users.Add(user);
                userFound = user;
                await _context.SaveChangesAsync(ct);
                curUserId = user.UserId.ToString();
            }
            else
            {
                curUserId = userFound.UserId.ToString();
            }
            //var xuser = await _context.Users.FindAsync(curUserId);
            ClaimsIdentity claimsIdentity = new(CookieAuthenticationDefaults.AuthenticationScheme);
            claimsIdentity.AddClaim(new Claim("UserId", curUserId));
            //claimsIdentity.AddClaim(new Claim("DbFirstName", userFound.FirstName));
            //claimsIdentity.AddClaim(new Claim("DbLastName", userFound.LastName));

            var adminfound = _context.AdminUsers.Where(a => a.Email == email );
            if (adminfound.Any())
            {
                claimsIdentity.AddClaim(new Claim("Auth", "Admin User"));
            }
            User.AddIdentity(claimsIdentity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, User);
            await SendRedirectAsync(redirectUrl,cancellation: ct);
        }

    }
}
