using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace DeskBooking.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Space
    {
        [Key]
        public int SpaceId { get; set; }
        public string Name { get; set; } =string.Empty;
        public byte[]? FloorImage { get; set; }
        public bool DefaultImage { get; set; } = true;
    }
}
