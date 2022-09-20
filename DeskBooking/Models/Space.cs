using System.ComponentModel.DataAnnotations;

namespace DeskBooking.Models
{
    public class Space
    {
        [Key]
        public int SpaceId { get; set; }
        public string Name { get; set; } =string.Empty;
        [Required]
        public string FloorImage { get; set; } = string.Empty;
    }
}
