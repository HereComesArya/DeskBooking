
namespace DeskBooking.DTOs.Booking
{
    public class BookingResponseDto
    {
        public string UserName { get; set; } = string.Empty;
        public int SpaceId { get; set; }
        public int DeskId { get; set; }
        public string? DeskName { get; set; }
        public bool IsRepeating { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool Cancelled { get; set; } = false;
    }
}
