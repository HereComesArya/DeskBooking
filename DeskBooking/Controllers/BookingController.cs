using DeskBooking.Data;
using DeskBooking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HttpDeleteAttribute = Microsoft.AspNetCore.Mvc.HttpDeleteAttribute;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;

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
            return await _context.Bookings.Include(b => b.User).ToListAsync();
        }



        [Microsoft.AspNetCore.Mvc.HttpGet("getbydate")]

        public async Task<IEnumerable<Booking>> GetBookingsByDate(string start, string end)
        {
            DateTime startDate = DateTime.Parse(start);
            DateTime endDate = DateTime.Parse(end);
            var bookings = await _context.Bookings.Where(b => b.EndTime > startDate && b.StartTime < endDate).ToListAsync();
            return bookings;
        }

        [HttpGet("{UserId}")]

        public async Task<IActionResult> GetByUserId(int userId)
        {
            var bookings = _context.Bookings.Where(b => b.UserId == userId && b.StartTime > DateTime.Now).ToList();
            if (bookings.Any())
            {
                return Ok(bookings);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("getbydeskid")]
        public async Task<IEnumerable<Booking>> GetBookingByDeskId(int deskId)
        {

            var bookings = await _context.Bookings.Where(b => b.DeskId == deskId && b.StartTime > DateTime.Now).ToListAsync();
            return bookings;
        }

        [HttpPost("/deletebookings")]
        public async Task<IEnumerable<Booking>> DeleteBooking(int deskId)
        {
            var bookingstodelete = await _context.Bookings.Where(b => b.DeskId == deskId).ToListAsync();

            if (bookingstodelete.Any())
            {
                _context.Bookings.RemoveRange(bookingstodelete);
            }
            return _context.Bookings;
        }
        [HttpDelete("/deleteoldbookings")]

        public async Task<ActionResult<IEnumerable<Booking>>> DeleteOldbookings()
        {
            DateTime onedayago = DateTime.Now.AddDays(-1);
            var oldbookings = await _context.Bookings.Where(d => d.StartTime < onedayago).ToListAsync();

            if (oldbookings.Any())
            {
                _context.Bookings.RemoveRange(oldbookings);
                return Ok();
            }
            else
            {
                return BadRequest();
            }

        }

    }
}
