using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DeskBooking.Models
{
    public class Booking
    {
        [Key]
        [Required]
        public int BookingId { get; set; }
        [Required]
        public User User { get; set; }
        public int UserId { get; set; }
        [Required]
        public string StartTime { get; set; }
        [Required]
        public string EndTime { get; set; }
        [Required]

        public Desk Desk { get; set; }
        public int DeskId { get; set; }
        [Required]
        public string StartDate { get; set; }
        [Required]
        public string EndDate { get; set; }
    }
}
