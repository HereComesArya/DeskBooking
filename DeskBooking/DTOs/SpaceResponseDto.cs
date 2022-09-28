namespace DeskBooking.DTOs
{
    public class SpaceResponseDto
    {
        public int SpaceId;
        public string Name { get; set; } = string.Empty;
        public string? Image { get; set; }
        public bool DefaultImage { get; set; } = true;
    }
}
