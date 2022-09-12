using DeskBooking.Data;
using DeskBooking.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    }
}
