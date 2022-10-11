using DeskBooking.Data;
using DeskBooking.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HttpPutAttribute = Microsoft.AspNetCore.Mvc.HttpPutAttribute;

namespace DeskBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly DataContext _context;

        public ProfileController(DataContext context)
        {
            _context = context;
        }

        [HttpPut("changename")]
        public async Task<IActionResult> ChangeName(string fullName)
        {
            List<string> names = fullName.Split(' ').ToList();
            string firstName = names.First().ToString();
            names.RemoveAt(0);
            string lastName = String.Join(" ", names.ToArray());

            var user = await _context.Users.FindAsync(int.Parse(User.GetUserId()));
            if (user != null)
            {
                user.FirstName = firstName;
                user.LastName = lastName;
            }
            else
            {
                return BadRequest();
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

    }
}
