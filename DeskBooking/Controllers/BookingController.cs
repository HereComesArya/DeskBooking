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
using System.Globalization;

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
        [NonAction]
        public async Task<Dictionary<string, string>> GetDeskNamesAsync()
        {
            Dictionary<string, string> deskNames = new();
            int deskName = 1, space = -1;
            await _context.Desks.IgnoreQueryFilters().ForEachAsync(d =>
            {
                if (space != d.SpaceId)
                {
                    deskName = 1;
                }
                deskNames.Add(d.SpaceId.ToString() + d.DeskId.ToString(), deskName++.ToString());
                space = d.SpaceId;
            });
            return deskNames;
        }

        [HttpGet("getall")]
        public async Task<List<BookingResponseDto>> GetAllBookings(string type)
        {
            var deskNames = await GetDeskNamesAsync();
            var bookings = new List<Booking>();
            if (type != null && type.Equals("history"))
            {
                bookings = await _context.Bookings.Include(b => b.User)
                    .Where(b => b.EndDate.Date <= DateTime.Now.AddDays(-7).Date).ToListAsync();
            }
            else
            {
                bookings = await _context.Bookings.Include(b => b.User).Where(b => b.EndDate.Date >= DateTime.Now.Date && b.Cancelled == false).ToListAsync();
            }
            var returnData = _mapper.Map<List<BookingResponseDto>>(bookings);
            returnData.ForEach(b =>
            {
                b.DeskName = deskNames.GetValueOrDefault(b.SpaceId.ToString() + b.DeskId.ToString());
                var space = _context.Spaces.IgnoreQueryFilters().FirstOrDefault(s => s.SpaceId == b.SpaceId);
                b.SpaceName = space?.Name ?? "";
                b.SpaceDirections = space?.Directions ?? "";
            });
            return returnData;
        }

        [HttpGet("mybookings")]
        public async Task<List<BookingResponseDto>> UserBookings(string type)
        {
            //var mybookings = _context.Bookings.Where(b => b.UserId.ToString() == User.GetUserId()).ToListAsync();
            var deskNames = await GetDeskNamesAsync();
            var bookings = new List<Booking>();
            if(type != null && type.Equals("history"))
            {
                 bookings = await _context.Bookings.Where(b => b.UserId.ToString() == User.GetUserId() &&
                    b.EndDate <= DateTime.Now.AddDays(-7).Date).ToListAsync();
            }            
            else
            {
                 bookings = await _context.Bookings.Where(b => b.UserId.ToString() == User.GetUserId() &&
                    b.EndDate >= DateTime.Now.Date).ToListAsync();
            }
            var returnData = _mapper.Map<List<BookingResponseDto>>(bookings);
            returnData.ForEach(b =>
            {
                b.DeskName = deskNames.GetValueOrDefault(b.SpaceId.ToString() + b.DeskId.ToString());
                var space = _context.Spaces.IgnoreQueryFilters().FirstOrDefault(S => S.SpaceId == b.SpaceId);
                b.SpaceName = space?.Name ?? "";
                b.SpaceDirections = space?.Directions ?? "";
            });
            return returnData;
        }
        [HttpGet("getbydatetime")]
        public async Task<IEnumerable<Booking>> GetBookingsByDate(DateTime startDate, DateTime endDate)
        {
            //DateTime startDate = DateTime.Parse(start);
            //DateTime endDate = DateTime.Parse(end);
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

        [HttpPut("cancel")]
        public async Task<IActionResult> CancelBookingsAsync(int bookingId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if(booking == null)
            {
                return NotFound();
            }
            booking.Cancelled = true;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("userbookingsconflict")]
        public async Task<bool> UserBookingsConflict( DateTime startDate,DateTime endDate)
        {

            //DateTime startDate = DateTime.ParseExact(start, "yyyy-MM-ddTHH:mm:sszzz",CultureInfo.InvariantCulture);
            //DateTime endDate = DateTime.ParseExact(end, "yyyy-MM-ddTHH:mm:sszzz", CultureInfo.InvariantCulture);
            //var x = User.GetUserId();
            var bookingsWithinDate = await _context.Bookings.Where(b => b.UserId.ToString() == User.GetUserId() && b.Cancelled == false &&
                            b.StartDate.Date <= endDate.Date && b.EndDate.Date >= startDate.Date).ToListAsync();

            var bookingsWithinTime = bookingsWithinDate.Any(b => b.StartTime.TimeOfDay <= endDate.TimeOfDay && b.EndTime.TimeOfDay >= startDate.TimeOfDay);
            return bookingsWithinTime;

        }

        [HttpGet("mybookinghistory")]
        public async Task<ActionResult<List<BookingResponseDto>>> MyBookingHistory()
        {
            var bookings = _context.Bookings.Where(b => b.UserId.ToString() == User.GetUserId() && b.EndTime <= DateTime.Now && b.StartTime >= DateTime.Now.AddDays(-7)).ToList();
            List<BookingResponseDto> final = new();
            foreach (var booking in bookings)
            {
                var spaceofbooking = _context.Spaces.Where(s => s.SpaceId == booking.SpaceId).FirstOrDefault();
                if (spaceofbooking != null)
                {
                    var result = _mapper.Map<BookingResponseDto>(booking);
                    result.SpaceName = spaceofbooking.Name;
                    final.Add(result);
                }
            }
            return final;
        }
        

        [HttpGet("allbookinghistory")]
        public async Task<ActionResult<IEnumerable<BookingResponseDto>>> AllBookingHistory()
        {
            var bookings = _context.Bookings.Where(b => b.EndTime <= DateTime.Now && b.StartTime >= DateTime.Now.AddDays(-7)).ToList();
            List<BookingResponseDto> final = new();
            foreach(var booking in bookings)
            {
                var spaceofbooking = _context.Spaces.Where(s => s.SpaceId == booking.SpaceId).FirstOrDefault();
                if (spaceofbooking != null)
                {
                    var result = _mapper.Map<BookingResponseDto>(booking);
                    result.SpaceName = spaceofbooking.Name;
                    final.Add(result);
                }
            } 
            return final;
        }
    }
}
