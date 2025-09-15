using Employee.Data;
using Employee.Models;
using Microsoft.AspNetCore.Mvc;

namespace ResourceOnboardingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpdateController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UpdateController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPut("{id}")]
        public IActionResult UpdateResource(int id, EmployeeDetails updatedResource)
        {
            var resource = _context.EmployeeDetails.Find(id);
            if (resource == null)
            {
                return NotFound("Resource not found");
            }
             updatedResource.JoiningDate = DateTime.SpecifyKind(updatedResource.JoiningDate, DateTimeKind.Utc);
            _context.Entry(resource).CurrentValues.SetValues(updatedResource);
            _context.SaveChanges();

            return Ok("Resource updated successfully!");
        }
    }
}
