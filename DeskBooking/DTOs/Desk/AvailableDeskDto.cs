namespace DeskBooking.DTOs.Desk
{
    public class AvailableDeskDto
    {
        public int DeskId { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
        public bool IsAvailable { get; set; }
    }
}
