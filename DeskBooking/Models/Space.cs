using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace DeskBooking.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Space
    {
        [Key]
        public int SpaceId { get; set; }
        public int InitialDeskNo { get; set; } = 0;
        public string Name { get; set; } =string.Empty;
        public byte[]? FloorImage { get; set; }
        public bool DefaultImage { get; set; } = true;
    }
}
