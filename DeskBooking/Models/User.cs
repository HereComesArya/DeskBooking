using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace DeskBooking.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        [Key]
        [Required]
        public int UserId { get; set; }
        [Required]
        public string Email { get; set; } = String.Empty;   
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;

        public List<Booking> Bookings { get; set; }
    }
}
