import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UrlParamEnum } from "../../core/enum/urlParamEnum";
import { Utility } from "../../core/utility/utility";
import { CarManageRecord } from "../../core/_models/car-manage-record";
import { CarManageRecordDto } from "../../core/_models/car-manage-record-dto";
import { Company } from "../../core/_models/company";
import { Department } from "../../core/_models/department";
import { PaginatedResult } from "../../core/_models/pagination";
import { SCarManageRecordDto } from "../../core/_models/s-car-manage-record-dto";
import { CmsService } from "../../core/_services/cms.service";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {
  constructor(
    public utility: Utility,
    private activeRouter: ActivatedRoute,
    private route: Router,
    private cmsService: CmsService
  ) {}

  result: CarManageRecordDto[] = [];
  scarManageRecordDto: SCarManageRecordDto = new SCarManageRecordDto();
  deadlineNow = new Date(new Date().getTime() - 86400000); // now minus one day
  companyList: Company[] = [];
  departmentList: Department[] = [];

  ngOnInit() {
    this.scarManageRecordDto.signInDateS = this.utility.datepiper.transform(new Date(), 'yyyy-MM-dd');
    this.scarManageRecordDto.signInDateE = this.utility.datepiper.transform(new Date(), 'yyyy-MM-dd');
    this.getAllCompany();
    this.getAllDepartment();
  }

  edit(model: CarManageRecordDto) {
    var navigateTo = "/EditRecordPage";
    var navigationExtras = {
      queryParams: {
        signInDate: model.signInDate,
        licenseNumber: model.licenseNumber,
        actionCode: UrlParamEnum.Report,
      },
      skipLocationChange: true,
    };
    this.route.navigate([navigateTo], navigationExtras);
  }

  search() {
    this.utility.spinner.show();
    this.cmsService.getCarManageRecordDto(this.scarManageRecordDto).subscribe(
      (res: PaginatedResult<CarManageRecordDto[]>) => {
        this.result = res.result.map((model) => {
          if (
            new Date(model.signInDate).getTime() <
              new Date(this.deadlineNow).getTime() &&
            model.signOutDate  //已出廠的才需要控管
          ) {
            model.isDisplay = UrlParamEnum.NoNumber;
          } else {
            model.isDisplay = UrlParamEnum.YesNumber;
          }
          return model;
        });

        /*
        this.result.forEach((model)=>{
          if(new Date(model.signInDate).getTime() < new Date(this.deadlineNow).getTime()){
            model.isDisplay = UrlParamEnum.NoNumber;
          }else{
            model.isDisplay = UrlParamEnum.YesNumber;
          }

        });
        */
        this.scarManageRecordDto.setPagination(res.pagination);
        this.utility.spinner.hide();
        if (res.result.length < 1) {
          this.utility.alertify.confirm(
            "Sweet Alert",
            "No Data in these conditions of search, please try again.",
            () => {}
          );
        }
      },
      (error) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "System Notice",
          "Syetem is busy, please try later.",
          () => {}
        );
      }
    );
  }

  //分頁按鈕
  pageChangeds(event: any): void {
    this.scarManageRecordDto.currentPage = event.page;
    this.search();
  }

  export() {
    const url = this.utility.baseUrl + "CMS/exportReport";
    this.utility.exportFactory(url, "CMS_Report", this.scarManageRecordDto);
  }
  getAllDepartment() {
    this.utility.spinner.show();
    this.cmsService.getAllDepartment().subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.departmentList = res;
      },
      (error) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "System Notice",
          "Syetem is busy, please try later.",
          () => {}
        );
      }
    );
  }
  getAllCompany() {
    this.utility.spinner.show();
    this.cmsService.getAllCompany().subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.companyList = res;
      },
      (error) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "System Notice",
          "Syetem is busy, please try later.",
          () => {}
        );
      }
    );
  }
  confirmBtn(model: CarManageRecordDto) {
    this.utility.spinner.show();
    model.isConfirm = 'Y';
    
    this.cmsService.confirmRecord(model).subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "Sweet Alert",
          "Confirm Success !",
          () => {});  
      },
      (error) => {
        this.utility.spinner.hide();
        this.utility.alertify.error(error);
      }
    );
    
  }

}
