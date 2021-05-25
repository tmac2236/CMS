
using System.ComponentModel.DataAnnotations;

namespace API.Models.CMS
{
    public class User
    {
        [Key]
        public string Account { get; set; }
        [Key]
        public string Password { get; set; }
        public string Role { get; set; }
        public string IsValid { get; set; }
        public string? Email { get;set; }
    }
}
