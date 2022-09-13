using DeskBooking.Data;
using DeskBooking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HttpDeleteAttribute = Microsoft.AspNetCore.Mvc.HttpDeleteAttribute;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;
using HttpPutAttribute = Microsoft.AspNetCore.Mvc.HttpPutAttribute;


namespace DeskBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin")]
    public class DeskController : ControllerBase
    {
        private DataContext _context;

        public DeskController(DataContext context) => _context = context;


        [HttpGet]
        public async Task<IEnumerable<Desk>> Get()
        {
            return await _context.Desks.ToListAsync();
        }

        [HttpGet("{DeskId}")]
        public async Task<IActionResult> GetByDeskId(int DeskId)
        {
            var Desk = await _context.Desks.FindAsync(DeskId);
            return Desk == null ? NotFound() : Ok(Desk);
        }
        [HttpPost]
        public async Task<IActionResult> Create(Desk Desk)
        {
            await _context.Desks.AddAsync(Desk);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetByDeskId), new { DeskId = Desk.DeskId }, Desk);
        }
        [HttpPut("{DeskId}")]
        public async Task<IActionResult> Update(int DeskId, Desk Desk)
        {
            if (DeskId != Desk.DeskId) return BadRequest();
            _context.Entry(Desk).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpDelete("{DeskId}")]
        public async Task<IActionResult> Delete(int DeskId)
        {
            var DeskToDelete = await _context.Desks.FindAsync();
            if (DeskToDelete == null) return BadRequest();

            _context.Desks.Remove(DeskToDelete);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}