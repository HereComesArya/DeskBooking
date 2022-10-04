using DeskBooking.DTOs.Desk;
using DeskBooking.Models;

namespace DeskBooking.DTOs.Space
{
    public class SpaceUploadRequestDto
    {
        //public string Description { get; set; } = String.Empty;

        //public string ImageData { get; set; } = String.Empty;

        public string Name { get; set; } = string.Empty;
        public int StartingDesk { get; set; } = 0;
        public string DeskList { get; set; }
        public IFormFile? Image { get; set; }
        public bool DefaultImage { get; set; } = true;
    }
}
