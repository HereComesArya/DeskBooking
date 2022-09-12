using System.ComponentModel.DataAnnotations;

namespace DeskBooking.Models
{
    public class AuthUser
    {
        [Key]   
        public int UserId { get; set; }
        [Required]
        public bool IsAdmin { get; set; }
    }
}
