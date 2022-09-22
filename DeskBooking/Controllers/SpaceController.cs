using DeskBooking.Data;
using DeskBooking.Extensions;
using DeskBooking.Models;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Imaging;
using System;
using HttpDeleteAttribute = Microsoft.AspNetCore.Mvc.HttpDeleteAttribute;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;
using HttpPutAttribute = Microsoft.AspNetCore.Mvc.HttpPutAttribute;

namespace DeskBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpaceController : ControllerBase
    {
        private readonly DataContext _context;
 

        public SpaceController(DataContext context)
        {
   
            _context = context;
        }


        [HttpPost("addspace")]
        public async Task <ActionResult<IEnumerable<Space>>> AddSpaces(IEnumerable<Space> space)
        {
            await _context.Spaces.AddRangeAsync(space);
            await _context.SaveChangesAsync();
            return Ok(await _context.Spaces.ToListAsync());
        }


        [HttpDelete("deletespace")]
        public async Task<ActionResult<IEnumerable<Space>>> DeleteSpace(int spaceId)
        {
            var spacestodelete = _context.Spaces.Where(s => s.SpaceId== spaceId);

            if(spacestodelete.Any())
            {
                  _context.Spaces.RemoveRange(spacestodelete);
                 await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest();
            }
               return Ok(await _context.Spaces.ToListAsync());
                
        }

        [HttpGet("howmany")]
        public async Task<ActionResult<IEnumerable<Space>>> HowMany()
        {
            //var noofspaces = _context.Spaces.Count();
            return Ok(_context.Spaces.Count()) ;
        }

        [HttpGet("getallspaces")]
        public async Task<ActionResult<IEnumerable<Space>>> GetAll()
        {
            return await _context.Spaces.ToListAsync();
            
        }

        [HttpPut("updatespace")]
        public async Task<ActionResult<List<Space>>> UpdateSpace(Space spaces)
        {
            var updatedvalue = await _context.Spaces.FindAsync(spaces.SpaceId);

            if (updatedvalue != null)
            {
                updatedvalue.SpaceId = spaces.SpaceId;
                updatedvalue.Name = spaces.Name;
                updatedvalue.FloorImage = spaces.FloorImage;
            }
            else
            {
                return BadRequest();
            }
      

            await _context.SaveChangesAsync();

            return Ok(await _context.Spaces.ToListAsync());
        }

        [HttpGet("ifexists")]
         public async Task <bool> IfExists(string name)
        {
            bool exists = false;
            var anydata = _context.Spaces.Where(s => s.Name == name);

            if (anydata.Any())
            {
                exists = true;  
            }
            return exists;
        }
    }
}
