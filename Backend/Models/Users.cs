namespace Employee.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
    }
    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class SignupModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string EmailId { get; set; }
    }
    public class RoleChangeDto
{
    public string UserName { get; set; }
    public string Role { get; set; }
}
}