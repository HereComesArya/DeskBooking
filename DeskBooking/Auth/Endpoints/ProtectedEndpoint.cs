using DeskBooking.Extensions;

namespace DeskBooking.Auth.Endpoints
{
    public class ProtectedEndpoint : EndpointWithoutRequest
    {
        public override void Configure()
        {
            Get("/api/userinfo");
            Summary(b => b.Description = "Returns User Information");
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            //var userId = User.GetGoogleIdentitfier();

            //ArgumentNullException.ThrowIfNull(userId);
            var user = User;

            await SendAsync(new
            {
                Name = User.GetUserId(),
            }, 200, ct);
        }
    }
}
