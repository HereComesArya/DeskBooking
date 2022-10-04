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
        public async Task<string> GetPicture()
        {

            string pictureFromInititals = $"https://ui-avatars.com/api/?background=random&size=100&name={User.GetFirstName()}+{User.GetLastName()}";
            var client = _httpClientFactory.CreateClient();
            var googleAccountId = User.GetOauthIdentifier();
           
            
            if (User.Identity!.AuthenticationType.ToLower() == "google")
            {
                //client.BaseAddress = new Uri("");
                string peopleApiKey = _configuration["GoogleApiKey:PeopleApiKey"];

                var photosResponse = await client.GetFromJsonAsync<PeopleApiPhotos>(
                        $"https://people.googleapis.com/v1/people/{googleAccountId}?personFields=photos&key={peopleApiKey}");
                if (photosResponse.photos.FirstOrDefault()!.@default != null)
                {
                    return pictureFromInititals;
                }
                return photosResponse?.photos.FirstOrDefault()?.url ?? "";          
            }
              return pictureFromInititals;
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            //var userId = User.GetGoogleIdentitfier();

            //ArgumentNullException.ThrowIfNull(userId);
            string pictureUri = await GetPicture();
            var obj = new
            {
                Name = User.GetFirstName(),
                PhotoUri = pictureUri.ToString(),
                IsAdmin = User.IsAdmin()
            };
            await SendAsync(obj, 200, ct);
        }
    }
}
    