using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DeskBooking.Models
{
    public class Desk
    {       
        [Required]
        public int DeskId { get; set; }
        [Required]
        public int SpaceId { get; set; }
        [Required]
        public float Xcoordinate { get; set; }
        [Required]
        public float Ycoordinate { get; set; }
    }
}
