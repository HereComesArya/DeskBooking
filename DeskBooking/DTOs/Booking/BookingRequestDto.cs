using DeskBooking.Models;

namespace DeskBooking.DTOs.Booking
{
    public class BookingRequestDto
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int SpaceId { get; set; }
        public int DeskId { get; set; }
        public bool IsRepeating { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
