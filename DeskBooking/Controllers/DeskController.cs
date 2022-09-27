using DeskBooking.Data;
using DeskBooking.DTOs;
using DeskBooking.Extensions;
using DeskBooking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        [Microsoft.AspNetCore.Mvc.HttpGet("getall")]
        public async Task<IEnumerable<Desk>> GetDesks(int? spaceId)
        {
            if (spaceId != null)
            {
                return await _context.Desks.Where(d => d.SpaceId == spaceId).ToListAsync();
            }
            return await _context.Desks.ToListAsync();
        }


        [Microsoft.AspNetCore.Mvc.HttpPost("edit")]
        public async Task<ActionResult<IEnumerable<Desk>>> EditDesks(int spaceId, IEnumerable<Desk> desks)
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


        [Microsoft.AspNetCore.Mvc.HttpPost("add")]
        public async Task<ActionResult<IEnumerable<Desk>>> AddDesksAsync(int spaceId, IEnumerable<Desk> desks)
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

        [Microsoft.AspNetCore.Mvc.HttpPost("del")]
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
        [Microsoft.AspNetCore.Mvc.HttpGet("getdeskbyspace")]
        public async Task<IEnumerable<Desk>> GetDeskBySpace(int spaceId)
        {
            var returnData = _context.Desks.Where(d => d.SpaceId == spaceId);
            return returnData;
        }
    }
}
