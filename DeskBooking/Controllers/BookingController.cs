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
        public async Task<List<BookingResponseDto>> GetAllBookings()
        {
            Dictionary<string, string> deskNames = new();
            int deskName = 1, space = -1;
            await _context.Desks.ForEachAsync(d =>
            {
                if (space != d.SpaceId)
                    deskName = 1;
                deskNames.Add(d.SpaceId.ToString() + d.DeskId.ToString(), deskName++.ToString());
                space = d.SpaceId;
            });
            var returnData = await _context.Bookings.Where(b => b.EndTime >= DateTime.Now).Include(b => b.User)
                .Select(b => _mapper.Map<BookingResponseDto>(b)).ToListAsync();
            returnData.ForEach( b => {
                b.DeskName = deskNames.GetValueOrDefault(b.SpaceId.ToString() + b.DeskId.ToString());
                var space = _context.Spaces.Find(b.SpaceId);
                b.SpaceName = space?.Name ?? "";
                b.SpaceDirections = space?.Directions ?? "";
            } );
            return returnData;
        }

        [HttpGet("mybookings")]
        public async Task<List<BookingResponseDto>> UserBookings()
        {
            //var mybookings = _context.Bookings.Where(b => b.UserId.ToString() == User.GetUserId()).ToListAsync();
            
            Dictionary<string, string> deskNames = new();
            int deskName = 1, space = -1;
            await _context.Desks.ForEachAsync(d =>
            {
                if (space != d.SpaceId)
                { 
                    deskName = 1;
                }
                deskNames.Add(d.SpaceId.ToString() + d.DeskId.ToString(), deskName++.ToString());
                space = d.SpaceId;
            });
            var returnData = await _context.Bookings.Where(b => b.UserId.ToString() == User.GetUserId()).Include(b => b.User).Select(b => _mapper.Map<BookingResponseDto>(b)).ToListAsync();
            returnData.ForEach( b => {
                b.DeskName = deskNames.GetValueOrDefault(b.SpaceId.ToString() + b.DeskId.ToString());
                var space = _context.Spaces.Find(b.SpaceId);
                b.SpaceName = space?.Name ?? "";
                b.SpaceDirections = space?.Directions ?? "";
            });
            return returnData;
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
        public async Task<IEnumerable<Booking>> GetBookingByDeskId(int spaceId, int deskId)
        {
            var bookings = await _context.Bookings.Where(b => b.SpaceId == spaceId && b.DeskId == deskId && b.Cancelled == false && b.StartTime > DateTime.Now).ToListAsync();
            return bookings;
        }

        [NonAction]
        public async Task<bool> CheckAvailable(BookingRequestDto booking)
        {
            var bookingsWithinDate = await _context.Bookings.Where(b => b.SpaceId == booking.SpaceId && b.DeskId == booking.DeskId && b.Cancelled == false &&
                                b.StartDate <= booking.EndDate && b.EndDate >= booking.StartDate).ToListAsync();
            
            var bookingsWithinTime = bookingsWithinDate.Any(b => b.StartTime.TimeOfDay <= booking.EndTime.TimeOfDay && b.EndTime.TimeOfDay >= booking.StartTime.TimeOfDay);
            return !bookingsWithinTime;
        }


        [HttpPost("add")]
        public async Task<ActionResult<Booking>> AddBooking(int? userId, [FromBody] BookingRequestDto bookingDto)
        {
            if (await CheckAvailable(bookingDto) == false)
            {
                return BadRequest(new { Title = "Not available" });
            }
            var booking = _mapper.Map<Booking>(bookingDto);
            booking.User = await _context.Users.FindAsync(userId ?? int.Parse(User.GetUserId()!));
            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [Microsoft.AspNetCore.Mvc.HttpGet("getbyspace")]
        public async Task<IActionResult> GetBySpace(int spaceId)
        {
            var bookings = await _context.Bookings.Where(d => d.SpaceId == spaceId && d.Cancelled == false).ToListAsync();
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

        [HttpGet("userbookingsconflict")]
        public async Task<bool> UserBookingsConflict(string start, string end)
        {
            //DateTime startDate = DateTime.Parse(start).Date;
            //DateTime endDate = DateTime.Parse(end).Date;
            DateTime startDate = DateTime.Parse(start);
            DateTime endDate = DateTime.Parse(end);
            //var x = User.GetUserId();

            var bookingsWithinDate = await _context.Bookings.Where(b => b.UserId.ToString() == User.GetUserId() && b.Cancelled == false &&
                                b.StartDate.Date <= endDate.Date && b.EndDate.Date >= startDate.Date).ToListAsync();

            var bookingsWithinTime = bookingsWithinDate.Any(b => b.StartTime.TimeOfDay <= endDate.TimeOfDay && b.EndTime.TimeOfDay >= startDate.TimeOfDay);
            return bookingsWithinTime;

        }

        [HttpGet("mybookinghistory")]
        public async Task<ActionResult<IEnumerable<Booking>>> MyBookingHistory()
        {
            var bookings = _context.Bookings.Where(b => b.UserId.ToString() == User.GetUserId() && b.EndTime <= DateTime.Now && b.StartTime >= DateTime.Now.AddDays(-7)).ToList();
            return bookings;
        }

        [HttpGet("allbookinghistory")]
        public async Task<ActionResult<IEnumerable<Booking>>> AllBookingHistory()
        {
            var bookings = _context.Bookings.Where(b => b.EndTime <= DateTime.Now && b.StartDate >= DateTime.Now.AddDays(-7)).ToList();
            return bookings;
        }
    }
}
