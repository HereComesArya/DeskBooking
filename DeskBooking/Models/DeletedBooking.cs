using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DeskBooking.Models
{
    public class DeletedBooking
    {
        [Key]
        public int DBookingId { get; set; }
        [Required]
        //public User User { get; set; }
        public int DUserId { get; set; }
        [Required]
        public DateTime DStartTime { get; set; }
        [Required]
        public DateTime DEndTime { get; set; }

        //[ForeignKey("SpaceId,DeskId")]
        //public Desk Desk { get; set; }
        public int DSpaceId { get; set; }
        public int DDeskId { get; set; }

        [Required]
        public bool DIsRepeating { get; set; }
        [Required]
        public DateTime DStartDate { get; set; }
        [Required]
        public DateTime DEndDate { get; set; }
    }
}
