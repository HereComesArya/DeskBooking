using DeskBooking.Data;
using DeskBooking.DTOs;
using DeskBooking.Extensions;

namespace DeskBooking.Auth.Endpoints
{
    public class ProtectedEndpoint : EndpointWithoutRequest
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly DataContext _context;

        public ProtectedEndpoint(IHttpClientFactory httpClientFactory, IConfiguration configuration, DataContext context)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _context = context;
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
            var pictureUriTask = GetPicture();
            var user = await _context.Users.FindAsync(int.Parse(User.GetUserId()));
            var pictureUri = await pictureUriTask;
            if (user == null)
                return;
            var obj = new
            {
                Name = user.FirstName+ " " + user.LastName,
                PhotoUri = pictureUri.ToString(),
                IsAdmin = User.IsAdmin()
            };
            await SendAsync(obj, 200, ct);
        }
    }
}
    