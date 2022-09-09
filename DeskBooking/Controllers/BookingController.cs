using DeskBooking.Data;
using DeskBooking.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;

namespace DeskBooking.Controllers
{
    [Route("api/[controller]/")]
    public class BookingController : ControllerBase
    {
        private readonly DataContext _context;

        public BookingController(DataContext context)
        {
            _context = context;
        }
        [Microsoft.AspNetCore.Mvc.HttpGet("getall")]
        public async Task<IEnumerable<Booking>> GetAllBookings()
        {
            return await _context.Bookings.ToListAsync();
        }

        [HttpGet("getbydate")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<Booking>> GetBookingsByDate(string start, string end)
        {
            DateTime startDate = DateTime.Parse(start);
            DateTime endDate = DateTime.Parse(end);
            var bookings = await _context.Bookings.Where(b => b.EndTime > startDate && b.StartTime < endDate).ToListAsync();
            return bookings;
        }

        [HttpGet("{UserId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByUserId(int UserId)
        {
            var Booking = await _context.Bookings.FindAsync(UserId);
            return Booking == null ? NotFound() : Ok(Booking);
        }

        [HttpGet("getbydeskid")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<Booking>> GetBookingByDeskId(int DeskId)
        {
            DateTime nowtime = DateTime.Now;
            int idofdesk = DeskId;
            var bookings = await _context.Bookings.Where(b => b.DeskId == idofdesk && b.StartTime > nowtime).ToListAsync();
            return bookings;
        }


    }
}
