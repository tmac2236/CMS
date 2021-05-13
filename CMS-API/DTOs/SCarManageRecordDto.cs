using System;
using API.Helpers;

namespace CMS_API.DTOs
{
    public class SCarManageRecordDto : PaginationParams
    {
        public string LicenseNumber { get; set; }
        public string SignInDateS { get; set; }
        public string SignInDateE { get; set; }
        public string CompanyId { get; set; }
        public string DriverName { get; set; }
        public string SignInReason { get; set; }
        public string DepartmentId { get; set; }
        public string ContactPerson { get; set; }
        public string SignOutDate { get; set; }

    }
}