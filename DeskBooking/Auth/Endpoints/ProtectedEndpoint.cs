using DeskBooking.DTOs;
using DeskBooking.Extensions;

namespace DeskBooking.Auth.Endpoints
{
    public class ProtectedEndpoint : EndpointWithoutRequest
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public ProtectedEndpoint(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }
        public override void Configure()
        {
            Get("/api/userinfo");
            Summary(b => b.Description = "Returns User Information");
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            //var userId = User.GetGoogleIdentitfier();

            //ArgumentNullException.ThrowIfNull(userId);
            var client =  _httpClientFactory.CreateClient();
            var googleAccountId = User.GetOauthIdentifier();
            string pictureUri = string.Empty;
            if (User.Identity!.AuthenticationType.ToLower() == "google")
            {
                //client.BaseAddress = new Uri("");
                string peopleApiKey = _configuration["GoogleApiKey:PeopleApiKey"];
                
                var photosResponse = await client.GetFromJsonAsync<PeopleApiPhotos>(
                        $"https://people.googleapis.com/v1/people/{googleAccountId}?personFields=photos&key={peopleApiKey}");
                    pictureUri = photosResponse?.photos.FirstOrDefault()?.url ?? "";
            }
            var obj = new
            {
                Name = pictureUri,
                //LastName = User.GetLastName(),
                //PhotoUri = pictureUri.ToString()
            };
            await SendAsync(obj, 200, ct);
        }
    }
}
