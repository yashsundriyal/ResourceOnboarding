using Microsoft.AspNetCore.Mvc;
using Employee.Models;
using Employee.Data;

namespace ResourceOnboardingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AddController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult AddResource(EmployeeDetails resource)
        {
            resource.JoiningDate = DateTime.SpecifyKind(resource.JoiningDate, DateTimeKind.Utc);
            _context.EmployeeDetails.Add(resource);
           int result = _context.SaveChanges(); // returns number of state entries written to the database
        if (result > 0)
        {
            return CreatedAtAction(nameof(AddResource), new { id = resource.Id },
                new { message = "Employee added successfully!", employeeId = resource.Id, rowsAffected = result });
        }
        else
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "No changes were saved to the database." });
        }
        }
    }
}