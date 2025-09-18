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
            try
            {
                resource.JoiningDate = DateTime.SpecifyKind(resource.JoiningDate, DateTimeKind.Utc);
                _context.EmployeeDetails.Add(resource);
                _context.SaveChanges();

                return Ok(new { message = "Employee added successfully!", employeeId = resource.Id });
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                Console.WriteLine(ex);
               if (ex.InnerException is Npgsql.PostgresException pgEx && pgEx.SqlState == "23505")
                {
                    return Conflict(new { message = "Email already exists. Please use a different email." });
                }

                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }
    }
}