using System.Collections.Generic;
using System.Linq;
using API.Data.Interface.CMS;
using API.Helpers;
using API.Models.CMS;
using CMS_API.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;

namespace API.Data.Repository.CMS
{
    public class CMSCarManageRecordDAO : CMSCommonDAO<CarManageRecord>, ICMSCarManageRecordDAO
    {
        public CMSCarManageRecordDAO(CMSContext context) : base(context)
        {
        }

        public async Task<List<CarManageRecordDto>> GetCarManageRecordDto(SCarManageRecordDto sCarManageRecordDto)
        {

            string strWhere = " WHERE SignInDate between '" + sCarManageRecordDto.SignInDateS + "' and '" + sCarManageRecordDto.SignInDateE + "' ";
            if (!(sCarManageRecordDto.LicenseNumber == "" || sCarManageRecordDto.LicenseNumber == null))
                strWhere += " AND LicenseNumber = '" + sCarManageRecordDto.LicenseNumber.Trim() + "' ";
            if (!(sCarManageRecordDto.CompanyId != "" || sCarManageRecordDto.CompanyId != null))
                strWhere += " AND CompanyId = " + sCarManageRecordDto.CompanyId;
            if (!(sCarManageRecordDto.DriverName != "" || sCarManageRecordDto.DriverName != null))
                strWhere += " AND DriverName = '" + sCarManageRecordDto.DriverName.Trim() + "' ";
            if (!(sCarManageRecordDto.SignInReason != "" || sCarManageRecordDto.SignInReason != null))
                strWhere += " AND SignInReason = '" + sCarManageRecordDto.SignInReason.Trim() + "' ";
            if (!(sCarManageRecordDto.DepartmentId != "" || sCarManageRecordDto.DepartmentId != null))
                strWhere += " AND DepartmentId = " + sCarManageRecordDto.DepartmentId;
            if (!(sCarManageRecordDto.ContactPerson != "" || sCarManageRecordDto.ContactPerson != null))
                strWhere += " AND ContactPerson = '" + sCarManageRecordDto.ContactPerson.Trim() + "' ";
            if (sCarManageRecordDto.SignOutDate == "Y"){
                strWhere += " AND SignOutDate is not null " ;
            }else{
                strWhere += " AND SignOutDate is null ";
            }
                
            string strSQL = string.Format(@"
                                            SELECT 
                                            	   CP.CompanyName	  AS	CompanyName
                                                  ,PlateNumber		  AS	PlateNumber
                                                  ,DriverName		  AS	DriverName
                                                  ,LicenseNumber	  AS	LicenseNumber
                                                  ,SignInDate		  AS	SignInDate
                                            
                                                  ,TempNumber		  AS	TempNumber
                                                  ,CarTempNumber      AS	CarTempNumber
                                                  ,SignInReason		  AS	SignInReason
                                                  ,GoodsName		  AS	GoodsName
                                                  ,GoodsCount		  AS	GoodsCount
                                                  ,DPM.DepartmentName AS 	DepartmentName
                                            
                                                  ,ContactPerson	  AS	ContactPerson
                                                  ,SealNumber		  AS	SealNumber
                                                  ,DriverSign		  AS	DriverSign
                                                  ,SignOutDate		  AS	SignOutDate
                                                  ,GuardName	      AS	GuardName
                                            
                                                  ,C.CarSize		  AS	CarSize
                                            	  ,CP.CompanyDistance AS	CompanyDistance
                                                  ,0                  AS    isDisplay
                                            
                                              FROM CMSCarManageRecord AS	CMR
                                              left join CMSCompany AS CP on CP.Id = CMR.CompanyId
                                              left join CMSDepartment AS DPM on DPM.ID = CMR.DepartmentId
                                              left join CMSCar AS C on C.Id = CMR.CarId ");
            strSQL += strWhere;
            var data = await _context.GetCarManageRecordDto.FromSqlRaw(strSQL).ToListAsync();

            return data;

        }
    }
}