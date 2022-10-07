using DeskBooking.Data;
using DeskBooking.DTOs.Space;
using DeskBooking.Models;
using FastEndpoints;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.IO.Compression;
using System.Text;
using static System.Net.WebRequestMethods;
using HttpPost = Microsoft.AspNetCore.Mvc.HttpPostAttribute;

namespace DeskBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpaceController : ControllerBase
    //TODO: add starting desk number
    {
        private readonly DataContext _context;

        public SpaceController(DataContext context)
        {
            _context = context;
        }
        [Microsoft.AspNetCore.Mvc.HttpPost("add")]
        public async Task<ActionResult<Space>> AddSpaceAsync(string name, IFormFile? formFile)
        {
            var file = new Space();
            if (formFile != null)
            {
             
                using (var memoryStream = new MemoryStream())
                {
                    await formFile.CopyToAsync(memoryStream);

                    // Upload the file if less than 5 MB
                    if (memoryStream.Length < 5242880)
                    {
                        file = new Space()
                        {
                            Name = name,
                            FloorImage = memoryStream.ToArray(),
                            DefaultImage = false
                        };
                    }
                    else
                    {
                        return BadRequest(new { title = "File too large" });
                    }
                }
            }
            else
            {
                file = new Space()
                {
                    Name = name,
                    DefaultImage = true 
                };
            }
            await _context.Spaces.AddAsync(file);

            await _context.SaveChangesAsync();
            
            var returnData = await _context.Spaces.FirstOrDefaultAsync(s => s.Name == name);
            return returnData;
        }
       
        [Microsoft.AspNetCore.Mvc.HttpPost("addwithdesks")]
        public async Task<ActionResult> AddSpaceWithDesksAsync([FromForm] SpaceUploadRequestDto uploadRequestDto)
        {
            DeskController desk = new(_context);
            var addedSpace = await AddSpaceAsync(uploadRequestDto.Name, uploadRequestDto.Image);
            if (addedSpace.Value == null)
            {
                return BadRequest(addedSpace.Result);
            }
            await desk.AddDesksAsync(uploadRequestDto.DeskList);
            return NoContent();
        }

        [Microsoft.AspNetCore.Mvc.HttpGet("getall")]
        public async Task<IEnumerable<SpacesResponseDto>> GetAll()
        { 
            var returnData = await _context.Spaces.Select(s => new SpacesResponseDto()
            {
                SpaceId = s.SpaceId,
                Name = s.Name
            }).ToListAsync();
            return returnData;
        }
        [Microsoft.AspNetCore.Mvc.HttpGet("getspace")]
        public async Task<ActionResult<SpaceResponseDto>> GetSpace(int spaceId)
        {
            var space = await _context.Spaces.FindAsync(spaceId);
            if (space == null)
            {
                return NotFound();
            }
            return new SpaceResponseDto()
            {
                SpaceId = space.SpaceId,
                InitialDeskNo = space.InitialDeskNo,
                Name = space.Name,
                Image = space.DefaultImage ? null : "data:image/jpeg;base64," + Convert.ToBase64String(space.FloorImage!),
                DefaultImage = space.DefaultImage
            };
        }

        [HttpPost("modifyspace")]
        public async Task<IActionResult> ModifySpace([FromForm] ModifySpacesDto spaces)
        {
            var spacetoedit = await _context.Spaces.FindAsync(spaces.SpaceId);

            try
            {
                spacetoedit.Name = spaces.Name;
                spacetoedit.InitialDeskNo = spaces.InitialDeskNo;

                DeskController desk= new(_context);
                var newdesklist = await desk.EditDesks(spaces.SpaceId, spaces.DeskList);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception)
            {

                return BadRequest("Cannot modify space");
            }
        }
    }
}
