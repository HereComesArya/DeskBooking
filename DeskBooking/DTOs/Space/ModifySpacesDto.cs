namespace DeskBooking.DTOs.Space
{
    public class ModifySpacesDto
    {
        public int SpaceId { get; set; }
        public string Name { get; set; }
        public int  InitialDeskNo { get; set; }
        public IEnumerable<Models.Desk> DeskList { get; set; }
    }
}
