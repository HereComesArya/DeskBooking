using DeskBooking.Data;
using DeskBooking.Extensions;
using DeskBooking.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeskBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeskController : ControllerBase
    {
        private readonly DataContext _context;

        public DeskController(DataContext context)
        {
            _context = context;
        }

        [Microsoft.AspNetCore.Mvc.HttpGet("/getall")]
        public async Task<IEnumerable<Desk>> GetDesks(int? roomId)
        {
            if (roomId != null)
            {
                return await _context.Desks.Where(d => d.RoomId == roomId).ToListAsync();
            }
            return await _context.Desks.ToListAsync();
        }


        [Microsoft.AspNetCore.Mvc.HttpPost("/edit")]
        public async Task<ActionResult<IEnumerable<Desk>>> AddDesks(int roomId, IEnumerable<Desk> desks)
        {
            try
            {
                var deskList = await _context.Desks.ToListAsync();
                var intersect = deskList.IntersectBy(desks.Select(t => t.DeskId), d => d.DeskId);
                var deletedDesks = deskList.ExceptBy(intersect.Select(t => t.DeskId), d => d.DeskId).ToList();
                var addedDesks = desks.ExceptBy(intersect.Select(t => t.DeskId), d => d.DeskId).ToList();

                await _context.Desks.AddRangeAsync(addedDesks);
                _context.Desks.RemoveRange(deletedDesks);
                await _context.SaveChangesWithIdentityInsertAsync<Desk>();
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


        [Microsoft.AspNetCore.Mvc.HttpPost("/add")]
        public async Task<ActionResult<IEnumerable<Desk>>> AddDesksAgain(int roomId, IEnumerable<Desk> desks)
        {
            try
            {
                await _context.Desks.AddRangeAsync(desks);
                await _context.SaveChangesWithIdentityInsertAsync<Desk>();
            }
            catch (Exception)
            {

                return BadRequest(new
                {
                    title= "Cannot add desk",
                    status = 400
                });
            }           
            return await _context.Desks.ToListAsync();
            //return deletedDesks;
        }

        [Microsoft.AspNetCore.Mvc.HttpPost("/del")]
        public async Task<ActionResult<IEnumerable<Desk>>> DeleteDesksAgain(int roomId, IEnumerable<Desk> desks)
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
    }
}
