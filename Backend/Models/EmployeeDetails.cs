namespace Employee.Models
{
    public class EmployeeDetails
    {
        public int Id { get; set; }          // Primary key
        public string Name { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }
        public DateTime JoiningDate { get; set; }
        public string? MobileNumber { get; set; }
    }
}
