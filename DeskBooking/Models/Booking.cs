using System.ComponentModel.DataAnnotations;
 
namespace DeskBooking.Models
{
    public class Booking
    {

        [Key]
        public int BookingId { get; set; }
        [Required]
        public User User { get; set; }
        public int UserId { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }


        public Desk? Desk { get; set; }
        public int? SpaceId { get; set; }
        public int? DeskId { get; set; }

        [Required]
        public bool IsRepeating { get; set; }
        [Required]
        public DateTime StartDate { get; set; } 
        [Required]
        public DateTime EndDate { get; set; }

        public bool Cancelled { get; set; } = false;
    }
}
