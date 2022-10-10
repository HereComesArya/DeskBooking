using DeskBooking.Data;
using DeskBooking.DTOs.Desk;
using DeskBooking.Extensions;
using DeskBooking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;
using HttpPutAttribute = Microsoft.AspNetCore.Mvc.HttpPutAttribute;
using IMapper = AutoMapper.IMapper;

namespace DeskBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy="Admin")]
    public class DeskController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public DeskController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("getall")]
        public async Task<IEnumerable<Desk>> GetDesks(int? spaceId)
        {
            if (spaceId != null)
            {
                return await _context.Desks.Where(d => d.SpaceId == spaceId).Include(d => d.Bookings).ToListAsync();
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
        public async Task<ActionResult<IEnumerable<Desk>>> EditDesks(int spaceId, IList<DeskRequestDto> reqDesksDto)
        {
            try
            {
                var desks = _mapper.Map<List<Desk>>(reqDesksDto);
                desks.ForEach(d => d.SpaceId = spaceId);
                var deskList = await _context.Desks.Where(d => d.SpaceId == spaceId).Include(d => d.Bookings).ToListAsync();
                var intersect = deskList.IntersectBy(desks.Select(t => t.DeskId), d => d.DeskId);
                var deletedDesks = deskList.ExceptBy(intersect.Select(t => t.DeskId), d => d.DeskId).ToList();
                var addedDesks = desks.ExceptBy(intersect.Select(t => t.DeskId), d => d.DeskId).ToList();
                
                deletedDesks.ForEach(desk => desk.Bookings.ForEach(b => b.Cancelled = true));

                await _context.Desks.AddRangeAsync(addedDesks);
                _context.Desks.RemoveRange(deletedDesks);
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
        public async Task<ActionResult<IEnumerable<Desk>>> DeleteDesks([FromQuery]int spaceId,[FromQuery] int deskId)
        {
            try
            {
                var desk = await _context.Desks.Where(d => d.SpaceId == spaceId && d.DeskId == deskId).ToListAsync();
                _context.Desks.RemoveRange(desk);
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
