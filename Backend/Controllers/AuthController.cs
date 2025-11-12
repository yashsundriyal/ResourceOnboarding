using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Employee.Data;
using Microsoft.AspNetCore.Mvc;
using Employee.Models;

using Microsoft.IdentityModel.Tokens;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _appDbContext;
    public AuthController(IConfiguration config, AppDbContext appDbContext)
    {
        _config = config;
        _appDbContext = appDbContext;
    }
    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginModel login)
    {
        var user = _appDbContext.Users.FirstOrDefault(u => u.Username == login.Username);
        if (user == null) return Unauthorized("User not found");

        var valid = BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash);
        if (!valid) return Unauthorized("Wrong Password!");

        var claims = new[]
        {
                new Claim(ClaimTypes.Name, login.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken
        (
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiryMinutes"])),
            signingCredentials: creds
        );
        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), role = user.Role });
    }
    [HttpPost("Signup")]
    public IActionResult Signup([FromBody] SignupModel model)
    {
        if (_appDbContext.Users.Any(u => u.Username == model.Username))
            return Conflict(new { message = "Username already exists." });

        if (_appDbContext.Users.Any(u => u.Email == model.EmailId))
            return Conflict(new { message = "Email already exists." });

        var user = new User
        {
            Username = model.Username,
            Email = model.EmailId,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
            Role = "User"
        };

        _appDbContext.Users.Add(user);
        _appDbContext.SaveChanges();

        return Ok(new { message = "User registered successfully." });
    }
    [HttpPut("RoleChange")]
    public IActionResult RoleChange([FromBody] RoleChangeDto dto)
    {
        Console.WriteLine($"Incoming: {dto?.UserName} - {dto?.Role}");

        var user = _appDbContext.Users.FirstOrDefault(u => u.Username == dto.UserName);
        if (user == null)
            return NotFound(new { message = "Username doesn't exist." });

        user.Role = dto.Role;
        _appDbContext.SaveChanges();

        return Ok(new { message = "Role updated successfully.", user });
    }
    [HttpGet("GetUsers")]
    public IActionResult GetUsers()
    {
        var users = _appDbContext.Users
            .Select(u => new RoleChangeDto
            {
                UserName = u.Username,
                Role = u.Role
            })
            .ToList();

        return Ok(users);
    }
}