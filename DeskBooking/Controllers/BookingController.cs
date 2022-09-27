using DeskBooking.Data;
using DeskBooking.Models;
using Microsoft.AspNetCore.Authorization;
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
            return await _context.Bookings.Include(b=>b.User).ToListAsync();
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
        public async Task<IActionResult> GetByUserId(int UserId)
        {
            var Booking = await _context.Bookings.FindAsync(UserId);
            return Booking == null ? NotFound() : Ok(Booking);
        }

        [HttpGet("getbydeskid")]
        public async Task<IEnumerable<Booking>> GetBookingByDeskId(int deskId)
        {          
            var bookings = await _context.Bookings.Where(b => b.DeskId == deskId && b.StartTime > DateTime.Now && (b.StartTime < DateTime.Now && b.EndTime > DateTime.Now)).ToListAsync();
            return bookings;
        }
        [Microsoft.AspNetCore.Mvc.HttpGet("getbyspace")]
        public async Task<IActionResult> GetBySpace(int spaceId)
        {
            var deskswewant = await _context.Desks.Where(d => d.SpaceId == spaceId).ToListAsync();
            if (deskswewant.Any())
            {
                List<Booking> bookingswewant = new List<Booking>();
                foreach (var desk in deskswewant)
                {
                    var d = desk.DeskId;
                    bookingswewant.Concat(_context.Bookings.Where(b => b.DeskId == d));
                }
                return Ok(bookingswewant);
            }
            else
            {
                return BadRequest("No data");
            }
            //return Ok(bookingswewant);
            //var deskswewant = await _context.Desks.Where(d => d.SpaceId == spaceId).ToListAsync();
            //_context.Bookings.Where(b => deskswewant.);
            //return await _context.Bookings.ToListAsync();
        }
    }
}
