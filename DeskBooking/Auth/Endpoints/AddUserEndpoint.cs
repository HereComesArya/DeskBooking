using DeskBooking.Data;
using DeskBooking.Extensions;

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
            var email = User.GetEmail();
            var firstName = User.GetFirstName();
            var lastName = User.GetLastName();
            var userFound = _context.Users.Where(u => u.Email == email);
            if (!userFound.Any())
            {
                Models.User user = new() { Email = email!, FirstName = firstName!, LastName = lastName! };
                _context.Users.Add(user);
                await _context.SaveChangesAsync(ct);
            }
            var redirectUrl = Query<string>("returnUrl") ?? "/";
            await SendRedirectAsync(redirectUrl,cancellation: ct);
            //await SendAsync(Response);
            //await SendAsync(new
            //{
            //    Name = email!,
            //    Claims = claims,
            //}, 200, ct);
        }
    }
}
