using DeskBooking.Models;

namespace DeskBooking.DTOs.Space
{
    public class SpaceUploadRequestDto
    {
        //public string Description { get; set; } = String.Empty;

        //public string ImageData { get; set; } = String.Empty;

        public string Name { get; set; } = string.Empty;
        public IEnumerable<Models.Desk>? DeskList { get; set; }
        public IFormFile? Image { get; set; }
        public bool DefaultImage { get; set; } = true;
    }
}
