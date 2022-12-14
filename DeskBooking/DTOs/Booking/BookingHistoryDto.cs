namespace DeskBooking.DTOs.Booking
{
    public class BookingHistoryDto
    {
        public int BookingId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int SpaceId { get; set; }
        public int DeskId { get; set; }
        //public string? DeskName { get; set; }
        public string? SpaceName { get; set; }
        //public string? SpaceDirections { get; set; }
        public bool IsRepeating { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool Cancelled { get; set; } = false;
    }
}
