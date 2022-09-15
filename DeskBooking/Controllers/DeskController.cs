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


        [Microsoft.AspNetCore.Mvc.HttpPost("/add")]
        public async Task<IEnumerable<Desk>> AddDesks(int roomId, IEnumerable<Desk> desks)
        {
            //await _context.Desks.AddRangeAsync(desks);
            var newDeskList = new List<Desk>();
            foreach (var d in desks)
            {
                if(!_context.Desks.Any(desk => desk.DeskId == d.DeskId))
                {
                    newDeskList.Add(d);
                }
            }
            await _context.Desks.AddRangeAsync(newDeskList);
            await _context.SaveChangesWithIdentityInsertAsync<Desk>();
            return await _context.Desks.ToListAsync();

        }
    }
}
