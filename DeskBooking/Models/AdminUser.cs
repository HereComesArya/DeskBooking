using System.ComponentModel.DataAnnotations;

namespace DeskBooking.Models
{
    public class AdminUser
    {
        [Key]   
        public string Email { get; set; } = string.Empty;
    }
}
