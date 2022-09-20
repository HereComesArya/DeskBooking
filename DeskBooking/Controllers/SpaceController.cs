using DeskBooking.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DeskBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpaceController : ControllerBase
    {
        private readonly DataContext _context;

        public SpaceController(DataContext context)
        {
            _context = context;
        }

    }
}
