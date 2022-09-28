using DeskBooking.Data;
using DeskBooking.DTOs;
using DeskBooking.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.IO.Compression;
using static System.Net.WebRequestMethods;

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

                    // Upload the file if less than 2 MB
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
            await desk.AddDesksAsync(addedSpace.Value.SpaceId, uploadRequestDto.DeskList);
            return Created("Successfully created", addedSpace);
        }

        [Microsoft.AspNetCore.Mvc.HttpGet("getall")]
        public async Task<IEnumerable<SpaceResponseDto>> GetAll()
        {
            var returnData = await _context.Spaces.Select(s => s.DefaultImage ? new SpaceResponseDto()
            {
                SpaceId = s.SpaceId,
                Name = s.Name,
                Image = null,
                DefaultImage = s.DefaultImage
            } :
                new SpaceResponseDto()
                {
                    SpaceId = s.SpaceId,
                    Name = s.Name,
                    Image = Convert.ToBase64String(s.FloorImage!),
                    DefaultImage = s.DefaultImage
                }).ToListAsync();
            return returnData;
        }
    }
}
