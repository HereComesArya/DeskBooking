using AutoMapper;
using DeskBooking.Data;
using DeskBooking.Extensions;
using DeskBooking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using FromBodyAttribute = Microsoft.AspNetCore.Mvc.FromBodyAttribute;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;
using HttpDeleteAttribute = Microsoft.AspNetCore.Mvc.HttpDeleteAttribute;
using IMapper = AutoMapper.IMapper;
using DeskBooking.DTOs.Booking;
using HttpPutAttribute = Microsoft.AspNetCore.Mvc.HttpPutAttribute;

namespace DeskBooking.Controllers
{
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public BookingController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
     
        [HttpGet("getall")]
        public async Task<IEnumerable<Booking>> GetAllBookings()
        {
            return await _context.Bookings.ToListAsync();
        }
        [HttpGet("mybookings")]
        public async Task<IEnumerable<Booking>> UserBookings()
        {
            return await _context.Bookings.Where(b => b.UserId.ToString() == User.GetUserId()).ToListAsync();
        }
        [HttpGet("getbydatetime")]
        public async Task<IEnumerable<Booking>> GetBookingsByDate(string start, string end)
        {
            DateTime startDate = DateTime.Parse(start);
            DateTime endDate = DateTime.Parse(end);

            var bookings = await _context.Bookings.Where(b => b.EndTime >= startDate && b.StartTime <= endDate).ToListAsync();
            return bookings;
        }

        [HttpGet("getbydeskid")]
        public async Task<IEnumerable<Booking>> GetBookingByDeskId(int spaceId,int deskId)
        {
            var bookings = await _context.Bookings.Where(b =>b.SpaceId == spaceId && b.DeskId == deskId && b.StartTime > DateTime.Now).ToListAsync();
            return bookings;
        }

        [NonAction]
        public async Task<bool> CheckAvailable(BookingRequestDto booking)
        {
            var bookingsWithinDate = await _context.Bookings.Where(b => b.SpaceId == booking.SpaceId && b.DeskId == booking.DeskId &&
                                b.StartDate <= booking.EndDate && b.EndDate >= booking.StartDate).ToListAsync();
            var bookingsWithinTime = bookingsWithinDate.Any(b => b.StartTime <= booking.EndTime && b.EndTime >= booking.StartTime);
            return !bookingsWithinTime;
        }

        [HttpPost("add")]
        public async Task<ActionResult<Booking>> AddBooking([FromBody] BookingRequestDto bookingDto)
        {
            if (await CheckAvailable(bookingDto) == false)
            {
                return BadRequest(new { Title = "Not available" });
            }
            var booking = _mapper.Map<Booking>(bookingDto);
            booking.UserId = int.Parse(User.GetUserId()!);
            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();
            return await _context.Bookings.FirstOrDefaultAsync();
        }

        [Microsoft.AspNetCore.Mvc.HttpGet("getbyspace")]
        public async Task<IActionResult> GetBySpace(int spaceId)
        {
            var bookings = await _context.Bookings.Where(d => d.SpaceId == spaceId).ToListAsync();
            if (bookings.Any())
            {
                return Ok(bookings);
            }
            else
            {
                return BadRequest("No data");
            }
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteBooking(int bookingId)
        {
            try
            {
                var booking = await _context.Bookings.FindAsync(bookingId);
                _context.Bookings.Remove(booking);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return BadRequest();
            }       
            
        }
<<<<<<< HEAD

        [HttpGet("meow")]
        public async Task<string> Meow(bool cat)
        {
            if (cat)
            {
                return ("Meow");
            }
            else
            {
                return ("Not a cat");
            }

        }
=======
>>>>>>> 472b22998a6393005c1215cf92a841cc3a9300ed
    }
}
