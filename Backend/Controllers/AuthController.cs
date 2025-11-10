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
        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    }
    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}