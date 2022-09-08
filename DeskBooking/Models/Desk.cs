using System.ComponentModel.DataAnnotations;

namespace DeskBooking.Models
{
    public class Desk
    {
        [Key]
        [Required]
        public int DeskId { get; set; }
        [Required]
        public int RoomId { get; set; }
        [Required]
        public float Xcoordinate { get; set; }
        [Required]
        public float Ycoordinate { get; set; }
    }
}
