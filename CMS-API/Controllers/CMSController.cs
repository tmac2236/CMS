using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Linq;
using API.Data.Interface.CMS;
using API.Models.CMS;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using API.DTOs;
using System.Threading.Tasks;
using CMS_API.DTOs;
using API.Helpers;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class CMSController : ApiController
    {
        private readonly ICMSCarDAO _cMSCarDAO;
        private readonly ICMSCarManageRecordDAO _cMSCarManageRecordDAO;
        private readonly ICMSCompanyDAO _cMSCompanyDAO;
        private readonly ICMSDepartmentDAO _cMSDepartmentDAO;
        public CMSController(IConfiguration config, IWebHostEnvironment webHostEnvironment, ILogger<CMSController> logger, ICMSCarDAO cMSCarDAO,
         ICMSCarManageRecordDAO cMSCarManageRecordDAO, ICMSCompanyDAO cMSCompanyDAO, ICMSDepartmentDAO cMSDepartmentDAO)
         : base(config, webHostEnvironment, logger)
        {
            _cMSCarDAO = cMSCarDAO;
            _cMSCarManageRecordDAO = cMSCarManageRecordDAO;
            _cMSCompanyDAO = cMSCompanyDAO;
            _cMSDepartmentDAO = cMSDepartmentDAO;

        }
        [HttpPost("addOrUpdateCompanyList")]
        public async Task<IActionResult> addOrUpdateCompanyList(List<Company> companyList)
        {
            _logger.LogInformation(String.Format(@"******  CMSController addOrUpdateCompanyList fired!! ******"));

            var updateList = companyList.Where(x => x.Id != 0).ToList();
            var addList = companyList.Where(x => x.Id == 0).ToList();
            updateList.ForEach(m =>
            {
                // m.CreateDate = Extensions.GetDateTimeNowInMillionSec();
                _cMSCompanyDAO.Update(m);
            });
            await _cMSCompanyDAO.SaveAll();
            //取出最後一個Id
            int lastId = _cMSCompanyDAO.FindAll().OrderByDescending(m => m.Id).FirstOrDefault().Id;
            addList.ForEach(m =>
            {
                lastId++;
                m.Id = lastId;
                m.CreateDate = Extensions.GetDateTimeNowInMillionSec();
                _cMSCompanyDAO.Add(m);
            });

            await _cMSCompanyDAO.SaveAll();

            return Ok(true);
        }
        [HttpPost("addOrUpdateCarList")]
        public async Task<IActionResult> addOrUpdateCarList(List<Car> carList)
        {
            _logger.LogInformation(String.Format(@"******  CMSController addOrUpdateCarList fired!! ******"));
            var updateList = carList.Where(x => x.Id != 0).ToList();
            var addList = carList.Where(x => x.Id == 0).ToList();
            updateList.ForEach(m =>
            {
                _cMSCarDAO.Update(m);
            });
            await _cMSCarDAO.SaveAll();
            //取出最後一個Id
            int lastId = _cMSCarDAO.FindAll().OrderByDescending(m => m.Id).FirstOrDefault().Id;
            addList.ForEach(m =>
            {
                lastId++;
                m.Id = lastId;
                _cMSCarDAO.Add(m);
            });

            await _cMSCarDAO.SaveAll();

            return Ok(true);

        }
        [HttpPost("addOrUpdateDepartmentList")]
        public async Task<IActionResult> addOrUpdateDepartmentList(List<Department> departmentList)
        {
            _logger.LogInformation(String.Format(@"******  CMSController addOrUpdateDepartmentList fired!! ******"));

            var updateList = departmentList.Where(x => x.Id != 0).ToList();
            var addList = departmentList.Where(x => x.Id == 0).ToList();
            updateList.ForEach(m =>
            {
                _cMSDepartmentDAO.Update(m);
            });
            await _cMSDepartmentDAO.SaveAll();
            //取出最後一個Id
            int lastId = _cMSDepartmentDAO.FindAll().OrderByDescending(m => m.Id).FirstOrDefault().Id;
            addList.ForEach(m =>
            {
                lastId++;
                m.Id = lastId;
                _cMSDepartmentDAO.Add(m);
            });

            await _cMSDepartmentDAO.SaveAll();

            return Ok(true);
        }
        [HttpGet("getAllCarList")]
        public IActionResult GetAllCarList()
        {
            _logger.LogInformation(String.Format(@"******  CMSController getAllCarList fired!! ******"));
            var result = _cMSCarDAO.FindAll().ToList();
            return Ok(result);
        }
        [HttpGet("getAllCompany")]
        public IActionResult GetAllCompany()
        {
            _logger.LogInformation(String.Format(@"******  CMSController getAllCompany fired!! ******"));
            var result = _cMSCompanyDAO.FindAll().ToList();
            return Ok(result);
        }
        [HttpGet("getAllDepartment")]
        public IActionResult GetAllDepartment()
        {
            _logger.LogInformation(String.Format(@"******  CMSController GetAllDepartment fired!! ******"));
            var result = _cMSDepartmentDAO.FindAll().ToList();
            return Ok(result);
        }
        [HttpGet("getAllCarCompanyDepartment")]
        public IActionResult GetAllCarCompanyDepartment()
        {
            _logger.LogInformation(String.Format(@"******  CMSController GetAllCarCompanyDepartment fired!! ******"));
            var cars = _cMSCarDAO.FindAll().ToList();
            var companys = _cMSCompanyDAO.FindAll().ToList();
            var departments = _cMSDepartmentDAO.FindAll().ToList();
            List<object> result= new List<object>();
            result.Add(cars);
            result.Add(companys);
            result.Add(departments);
            
            return Ok(result);
        }
        [HttpPost("getTheRecord")]
        public IActionResult GetTheRecord(CarManageRecord carManageRecord)
        {
            _logger.LogInformation(String.Format(@"******  CMSController GetTheRecord fired!! ******"));
            var theModel = _cMSCarManageRecordDAO
            .FindSingle(x => x.LicenseNumber == carManageRecord.LicenseNumber && x.SignInDate == carManageRecord.SignInDate);
            return Ok(theModel);
        }
        // Get the record by liciense and the last date of SignInDate
        [HttpPost("getLastRecord")]
        public IActionResult getLastRecord(CarManageRecord carManageRecord)
        {
            _logger.LogInformation(String.Format(@"******  CMSController getLastRecord fired!! ******"));
            var theModel = _cMSCarManageRecordDAO
                .FindAll(x => x.LicenseNumber == carManageRecord.LicenseNumber)
                 .OrderByDescending(x => x.SignInDate).Take(1).ToList().FirstOrDefault();
            return Ok(theModel);

        }
        [HttpPost("addRecord")]
        public async Task<IActionResult> AddRecord(CarManageRecord model)
        {
            _logger.LogInformation(String.Format(@"******  CMSController AddRecord fired!! ******"));
            //取到秒的Datetime
            //DateTime nowFormat = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day,
            //                                  DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second);

            model.SignInDate = Extensions.GetDateTimeNowInMillionSec();
            _cMSCarManageRecordDAO.Add(model);
            await _cMSCarManageRecordDAO.SaveAll();
            return Ok(model);

        }
        [HttpPost("editRecord")]
        public async Task<IActionResult> EditRecord(CarManageRecord model)
        {
            _logger.LogInformation(String.Format(@"******  CMSController EditRecord fired!! ******"));
            _cMSCarManageRecordDAO.Update(model);
            await _cMSCarManageRecordDAO.SaveAll();
            return Ok(model);

        }
        [HttpPost("signOutRecord")]
        public async Task<IActionResult> SignOutRecord(CarManageRecord model)
        {
            _logger.LogInformation(String.Format(@"******  CMSController SignOutRecord fired!! ******"));
            var theModel = _cMSCarManageRecordDAO
                .FindSingle(x => x.LicenseNumber == model.LicenseNumber && x.SignInDate == model.SignInDate);
            theModel.SignOutDate = Extensions.GetDateTimeNowInMillionSec();
            _cMSCarManageRecordDAO.Update(theModel);
            await _cMSCarManageRecordDAO.SaveAll();
            return Ok(theModel);
        }
        [HttpPost("confirmRecord")]
        public async Task<IActionResult> ConfirmRecord(CarManageRecordDto dto)
        {
            _logger.LogInformation(String.Format(@"******  CMSController ConfirmRecord fired!! ******"));
            var theModel = _cMSCarManageRecordDAO
            .FindSingle(x => x.LicenseNumber == dto.LicenseNumber && x.SignInDate == dto.SignInDate);
            theModel.IsConfirm = "Y";
            _cMSCarManageRecordDAO.Update(theModel);
            await _cMSCarManageRecordDAO.SaveAll();
            return Ok(theModel);
        }

        [HttpPost("exportReport")]
        public async Task<IActionResult> ExportReport(SCarManageRecordDto sCarManageRecordDto)
        {
            _logger.LogInformation(String.Format(@"******  CMSController ExportReport fired!! ******"));

            if (sCarManageRecordDto.SignInDateS == "" || sCarManageRecordDto.SignInDateS == null) sCarManageRecordDto.SignInDateS = _config.GetSection("LogicSettings:MinDate").Value;
            if (sCarManageRecordDto.SignInDateE == "" || sCarManageRecordDto.SignInDateE == null) sCarManageRecordDto.SignInDateE = _config.GetSection("LogicSettings:MaxDate").Value;
            sCarManageRecordDto.SignInDateE = sCarManageRecordDto.SignInDateE.ToDateTime().AddDays(1).ToString().Substring(0, 9).Replace('/', '-');

            var data = await _cMSCarManageRecordDAO.GetCarManageRecordDto(sCarManageRecordDto);

            byte[] result = CommonExportReport(data, "TempCarRecord.xlsx");

            return File(result, "application/xlsx");
        }

        [HttpPost("addSignaturePic")]
        public async Task<IActionResult> AddSignaturePic([FromForm] DriverSinatureDto source)
        {
            _logger.LogInformation(String.Format(@"******  CMSController AddSignaturePic fired!! ******"));
            //檔名含副檔名
            var formateDate = source.SignInDate.Replace(" ", "-").Replace(":", "-").Replace(".", "-");
            var fileName = source.LicenseNumber + "_" + formateDate + ".jpg";
            if (await SaveFiletoServer(source.File, "ReportPics", fileName))
            {
                DateTime dt = Convert.ToDateTime(source.SignInDate);
                var theModel = _cMSCarManageRecordDAO.FindSingle(x => x.LicenseNumber == source.LicenseNumber && x.SignInDate == dt);
                theModel.DriverSign = fileName;
                await _cMSCarManageRecordDAO.SaveAll();
            }
            return Ok();

        }

        [HttpGet("getCarManageRecordDto")]
        public async Task<IActionResult> GetCarManageRecordDto([FromQuery] SCarManageRecordDto sCarManageRecordDto)
        {
            _logger.LogInformation(String.Format(@"******  CMSController GetCarManageRecordDto fired!! ******"));

            if (sCarManageRecordDto.SignInDateS == "" || sCarManageRecordDto.SignInDateS == null) sCarManageRecordDto.SignInDateS = _config.GetSection("LogicSettings:MinDate").Value;
            if (sCarManageRecordDto.SignInDateE == "" || sCarManageRecordDto.SignInDateE == null) sCarManageRecordDto.SignInDateE = _config.GetSection("LogicSettings:MaxDate").Value;
            sCarManageRecordDto.SignInDateE = sCarManageRecordDto.SignInDateE.ToDateTime().AddDays(1).ToString().Substring(0, 9).Replace('/', '-');

            var data = await _cMSCarManageRecordDAO.GetCarManageRecordDto(sCarManageRecordDto);
            PagedList<CarManageRecordDto> result = PagedList<CarManageRecordDto>.Create(data, sCarManageRecordDto.PageNumber, sCarManageRecordDto.PageSize, sCarManageRecordDto.IsPaging);
            Response.AddPagination(result.CurrentPage, result.PageSize,
            result.TotalCount, result.TotalPages);

            return Ok(result);

        }

    }
}