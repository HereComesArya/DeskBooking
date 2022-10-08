﻿using DeskBooking.Data;
using DeskBooking.DTOs.Desk;
using DeskBooking.DTOs.Space;
using DeskBooking.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.IO.Compression;
using System.Text.Json;
using static System.Net.WebRequestMethods;
using FromBodyAttribute = Microsoft.AspNetCore.Mvc.FromBodyAttribute;

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
        public async Task<ActionResult<Space>> AddSpaceAsync(string name, string directions ,int initialDeskNo, IFormFile? formFile)
        {
            
            var space = new Space();
            if (formFile != null)
            {
             
                using (var memoryStream = new MemoryStream())
                {
                    await formFile.CopyToAsync(memoryStream);

                    // Upload the file if less than 5 MB
                    if (memoryStream.Length < 5242880)
                    {
                        space = new Space()
                        {
                            Name = name,
                            Directions = directions,
                            InitialDeskNo = initialDeskNo,
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
                space = new Space()
                {
                    Name = name,
                    Directions = directions,
                    InitialDeskNo = initialDeskNo,
                    DefaultImage = true 
                };
            }
            await _context.Spaces.AddAsync(space);
            
            await _context.SaveChangesAsync();
            
            //var returnData = await _context.Spaces.FirstOrDefaultAsync(s => s.Name == name);
            return space;
        }
       
        [Microsoft.AspNetCore.Mvc.HttpPost("addwithdesks")]
        public async Task<ActionResult> AddSpaceWithDesksAsync([FromForm] SpaceUploadRequestDto uploadRequestDto)
        {
            DeskController desk = new(_context);
            var addedSpace = await AddSpaceAsync(uploadRequestDto.Name,uploadRequestDto.Directions, uploadRequestDto.StartingDesk, uploadRequestDto.Image);
            if (addedSpace.Value == null)
            {
                return BadRequest(addedSpace.Result);
            }
            var spaceId = addedSpace.Value.SpaceId;
            var jsonDeskList = JsonSerializer.Deserialize<IList<DeskRequestDto>>(uploadRequestDto.DeskList);
            var deskList = jsonDeskList.Select(d => new Desk() { DeskId = d.id, SpaceId = spaceId, Xcoordinate = d.x, Ycoordinate = d.y});
            await desk.AddDesksAsync(deskList);
            return NoContent();
        }

        [Microsoft.AspNetCore.Mvc.HttpGet("getall")]
        public async Task<IEnumerable<SpacesResponseDto>> GetAll()
        { 
            var returnData = await _context.Spaces.Select(s => new SpacesResponseDto()
            {
                SpaceId = s.SpaceId,
                Name = s.Name,
                NumberOfDesks = s.Desks.Count
            }).OrderBy(s => s.SpaceId).ToListAsync();
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
                StartingDesk = space.InitialDeskNo,
                Name = space.Name,
                Directions = space.Directions,
                Image = space.DefaultImage ? null : "data:image/jpeg;base64," + Convert.ToBase64String(space.FloorImage!),
                DefaultImage = space.DefaultImage
            }; ;
        }
    }
}
