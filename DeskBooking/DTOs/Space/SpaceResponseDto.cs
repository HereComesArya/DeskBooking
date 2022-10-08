namespace DeskBooking.DTOs.Space
{
    public class SpaceResponseDto
    {
        public int SpaceId { get; set; }
        public int StartingDesk { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Directions { get; set; } = string.Empty;
        public string? Image { get; set; }
        public bool DefaultImage { get; set; } = true;
    }
}
