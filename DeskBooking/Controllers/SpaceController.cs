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
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;
using Microsoft.Extensions.Hosting;
using System.Net.Http.Headers;

namespace DeskBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpaceController : ControllerBase
    {
        private readonly DataContext _context;
        private IHostingEnvironment _environment;


        public SpaceController(DataContext context, IHostingEnvironment Environment)
        {

            _context = context;
            _environment = Environment;
        }


        [HttpPost("addspace")]
        public async Task<ActionResult<IEnumerable<Space>>> AddSpaces(IEnumerable<Space> space)
        {
            await _context.Spaces.AddRangeAsync(space);
            await _context.SaveChangesAsync();
            return Ok(await _context.Spaces.ToListAsync());
        }


        [HttpDelete("deletespace")]
        public async Task<ActionResult<IEnumerable<Space>>> DeleteSpace(int spaceId)
        {
            var spacestodelete = _context.Spaces.Where(s => s.SpaceId == spaceId);

            if (spacestodelete.Any())
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
            return Ok(_context.Spaces.Count());
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
        public async Task<bool> IfExists(string name)
        {
            bool exists = false;
            var anydata = _context.Spaces.Where(s => s.Name == name);

            if (anydata.Any())
            {
                exists = true;
            }
            return exists;
        }

        [HttpPost("uploadfiles")]
        public async Task<ActionResult<IEnumerable<Space>>> Index( string name, IFormFile postedFiles) 
        {
            ///string wwwPath = Environment.CurrentDirectory;
            //string wwwPath = System.MapPath();
            //string contentPath = _environment.ContentRootPath;
            byte[] fileBytes;

            //var updatedvalue =  _context.Spaces.Where(s => s.SpaceId == spaceId).ToList();
            using (var ms = new MemoryStream())
            {
                postedFiles.CopyTo(ms);
                fileBytes = ms.ToArray();
            }


                Models.Space space = new() {  Name = name!, FloorImage = fileBytes! };
                _context.Spaces.Add(space);
                await _context.SaveChangesAsync();
                return Ok();


            //string? path = Path.Combine(wwwPath, "ImageFolder");
            //if (!Directory.Exists(path))
            //{
            //    Directory.CreateDirectory(path);
            //}

            //List<string> uploadedFiles = new List<string>();
            //foreach (IFormFile postedFile in postedFiles)
            //{
            //    string fileName = Path.GetFileName(postedFile.FileName);
            //    using (FileStream stream = new FileStream(Path.Combine(path, fileName), FileMode.Create))
            //    {
            //        postedFile.CopyTo(stream);
            //        uploadedFiles.Add(fileName);
            //        //ViewBag.Message += string.Format("<b>{0}</b> uploaded.<br />", fileName);
            //        //return NoContent();
            //    }
            //}
            //return NoContent();
        }
    }
}
