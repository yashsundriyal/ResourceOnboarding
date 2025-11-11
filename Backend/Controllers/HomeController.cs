using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Employee.Models;
using Employee.Data;
using Microsoft.AspNetCore.Authorization;

namespace ResourceOnboardingAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly AppDbContext _context;
        public HomeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllResources()
        {
            var resources = _context.EmployeeDetails.ToList();
            return Ok(resources);
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteResource(int id)
        {
            var resource = _context.EmployeeDetails.Find(id);
    
             if (resource == null)
                {
                  return NotFound(new { message = $"Resource with ID {id} not found." });
                }

            _context.EmployeeDetails.Remove(resource);
            _context.SaveChanges();

         return Ok(new { message = $"Resource with ID {id} deleted successfully." });
        }
    }
}