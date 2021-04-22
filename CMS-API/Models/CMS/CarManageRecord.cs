using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace API.Models.CMS
{
    public class CarManageRecord
    {
        public string CompanyId { get; set; }
        public string PlateNumber { get; set; }
        public string DriverName { get; set; }
        [Key]
        public string LicenseNumber { get; set; }
        [Key]
        public DateTime SignInDate { get; set; }

        public string TempNumber { get; set; }
        public string SignInReason { get; set; }
        public string GoodsName { get; set; }
        public string GoodsCount { get; set; }
        public string DepartmentId { get; set; }

        public string ContactPerson { get; set; }
        public string SealNumber { get; set; }
        public string DriverSign { get; set; }
        public DateTime? SignOutDate { get; set; }
        public string GuardName { get; set; }

        public string CarId { get; set; }
    }
}