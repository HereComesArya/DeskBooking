namespace DeskBooking.DTOs.Space
{
    public class SpaceResponseDto
    {
        public int SpaceId;
        public int StartingDesk;
        public string Name { get; set; } = string.Empty;
        public string? Image { get; set; }
        public bool DefaultImage { get; set; } = true;
    }
}
