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
        
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByDate(string start, string end)
        {
            DateTime startDate = DateTime.Parse(start);
            DateTime endDate = DateTime.Parse(end);
            var bookings = await _context.Bookings.Where(b => b.EndTime > startDate && b.StartTime < endDate).ToListAsync();
            if (bookings.Any())
            {
                return Ok(bookings);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("getbyuserid")]

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
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingByDeskId(int deskId)
        {

            var bookings = await _context.Bookings.Where(b => b.DeskId == deskId && b.StartTime > DateTime.Now).ToListAsync();
            if (bookings.Any())
            {
                return Ok(bookings);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpDelete("/deletebookingsbydesk")]
        //[Authorize(Policy = "Admin")]
        public async Task<IEnumerable<Booking>> DeleteBooking(int deskId)
        {
            var bookingstodelete = await _context.Bookings.Where(b => b.DeskId == deskId).ToListAsync();

            if (bookingstodelete.Any())
            {
                _context.Bookings.RemoveRange(bookingstodelete);
                
            }
            await _context.SaveChangesAsync();
            return await _context.Bookings.ToListAsync();
        }
        [HttpDelete("/deleteoldbookings")]
        //[Authorize(Policy = "Admin")]
        public async Task<ActionResult<IEnumerable<Booking>>> DeleteOldbookings()
        {
            //DateTime onedayago = DateTime.Now.AddDays(-1);
            var oldbookings = await _context.Bookings.Where(d => d.StartTime < DateTime.Now.AddDays(-1)).ToListAsync();

            if (oldbookings.Any())
            {
                _context.Bookings.RemoveRange(oldbookings);
                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest(new
                {
                    title = "No old bookings found",
                    StatusCode = 404
                }) ;
            }

        }

    }
}
