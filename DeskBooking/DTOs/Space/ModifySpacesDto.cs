using DeskBooking.DTOs.Desk;

namespace DeskBooking.DTOs.Space
{
    public class ModifySpacesDto
    {
        public int SpaceId { get; set; }
        public string Name { get; set; }
        public int InitialDeskNo { get; set; }
        public IList<DeskRequestDto> DeskList { get; set; }
    }
}
