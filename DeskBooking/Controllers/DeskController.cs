using DeskBooking.Data;
using DeskBooking.DTOs.Desk;
using DeskBooking.Extensions;
using DeskBooking.Migrations;
using DeskBooking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;
using HttpPutAttribute = Microsoft.AspNetCore.Mvc.HttpPutAttribute;

namespace DeskBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy="Admin")]
    public class DeskController : ControllerBase
    {
        private readonly DataContext _context;

        public DeskController(DataContext context)
        {
            _context = context;
        }
        [HttpGet("getall")]
        public async Task<IEnumerable<Desk>> GetDesks(int? spaceId)
        {
            if (spaceId != null)
            {
                return await _context.Desks.Where(d => d.SpaceId == spaceId).ToListAsync();
            }
            return await _context.Desks.ToListAsync();
        }


        [HttpGet("/getavail")]
        public async Task<IEnumerable<AvailableDeskDto>> GetAvailable(int spaceId, DateTime startDate, DateTime endDate, DateTime startTime, DateTime endTime)
        {
            var desks = await GetDesks(spaceId);
            var spaceBookings = await _context.Bookings.Where(b => b.SpaceId == spaceId).ToListAsync();
            var bookings = spaceBookings.Where(b => b.StartDate <= endDate && b.EndDate >= startDate &&
                                                b.StartTime <= endTime && b.EndTime >= startTime).ToList();
            return desks.Select(d => bookings.Any(b => b.DeskId == d.DeskId) ? new
            AvailableDeskDto()
            {
                DeskId = d.DeskId,
                X = d.Xcoordinate,
                Y = d.Ycoordinate,
                IsAvailable = false
            } : new
           AvailableDeskDto()
            {
                DeskId = d.DeskId,
                X = d.Xcoordinate,
                Y = d.Ycoordinate,
                IsAvailable = true
            }
            );
        }


        [HttpPost("edit")]
        public async Task<ActionResult<IEnumerable<Desk>>> EditDesks(int spaceId, IEnumerable<Desk> desks)
        {
            try
            {
                var deskList = await _context.Desks.Where(d => d.SpaceId == spaceId).ToListAsync();
                var intersect = deskList.IntersectBy(desks.Select(t => t.DeskId), d => d.DeskId);
                var deletedDesks = deskList.ExceptBy(intersect.Select(t => t.DeskId), d => d.DeskId).ToList();
                var addedDesks = desks.ExceptBy(intersect.Select(t => t.DeskId), d => d.DeskId).ToList();

                await _context.Desks.AddRangeAsync(addedDesks);


                List<Booking> bookingstoremove = new();
                foreach (var ddesk in deletedDesks)
                {
                    //var x = ddesk.DeskId;
                    bookingstoremove.AddRange(_context.Bookings.Where(b => b.SpaceId == ddesk.SpaceId && b.DeskId == ddesk.DeskId).ToList());
                }
                //_context.Bookings.RemoveRange(bookingstoremove);
                //_context.DeletedBookings.AddRange(bookingstoremove);

                List<DeletedBooking> bookingstoadd = new();
                foreach (var d in bookingstoremove)
                {
                    var bookingtoadd = new DeletedBooking()
                    {
                        DBookingId = d.BookingId,
                        DUserId = d.UserId,
                        DStartTime = d.StartTime,
                        DEndTime = d.EndTime,
                        DSpaceId = d.SpaceId,
                        DDeskId = d.DeskId,
                        DIsRepeating = d.IsRepeating,
                        DStartDate = d.StartDate,
                        DEndDate = d.EndDate
                    };
                    //AddDeletedBookings(bookingtoadd);
                    bookingstoadd.Add(bookingtoadd);
                }
                await _context.DeletedBookings.AddRangeAsync(bookingstoadd);
                _context.Bookings.RemoveRange(bookingstoremove);
                _context.Desks.RemoveRange(deletedDesks);
                await _context.SaveChangesWithIdentityInsertAsync<DeletedBooking>();
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {

                return BadRequest(new
                {
                    title = "Cannot add desk",
                    status = 400
                });
            }

            return await _context.Desks.ToListAsync();
            //return deletedDesks;
        }


        [HttpPost("add")]
        public async Task<ActionResult<IEnumerable<Desk>>> AddDesksAsync(IEnumerable<Desk> desks)
        {
            try
            {
                await _context.Desks.AddRangeAsync(desks);
                // await _context.SaveChangesWithIdentityInsertAsync<Desk>();
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {

                return BadRequest(new
                {
                    title = "Cannot add desk",
                    status = 400
                });
            }
            return await _context.Desks.ToListAsync();
            //return deletedDesks;
        }

        [HttpPost("del")]
        public async Task<ActionResult<IEnumerable<Desk>>> DeleteDesks(int spaceId, IEnumerable<Desk> desks)
        {
            try
            {
                _context.Desks.RemoveRange(desks);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {

                return BadRequest();
            }
            return await _context.Desks.ToListAsync();
            //return deletedDesks;
        }

    //    [HttpPut("adddeletedbookings")]
    //    public async Task<IActionResult> AddDeletedBookings(DeletedBooking deletedbookings)
    //    {
    //        await _context.DeletedBookings.AddAsync(deletedbookings);
    //        await _context.SaveChangesAsync();
    //        return Ok();
    //    }
    }
}
