import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UrlParamEnum } from "../../core/enum/urlParamEnum";
import { Utility } from "../../core/utility/utility";
import { CarManageRecord } from "../../core/_models/car-manage-record";
import { CarManageRecordDto } from "../../core/_models/car-manage-record-dto";
import { Company } from "../../core/_models/company";
import { Department } from "../../core/_models/department";
import { PaginatedResult, Pagination } from "../../core/_models/pagination";
import { SCarManageRecordDto } from "../../core/_models/s-car-manage-record-dto";
import { CmsService } from "../../core/_services/cms.service";
import { defineLocale } from 'ngx-bootstrap/chronos';
import { zhCnLocale } from "ngx-bootstrap/locale"; //中文
import { viLocale } from "ngx-bootstrap/locale"; //越文
import { enGbLocale } from "ngx-bootstrap/locale"; //英文
defineLocale("zh-cn", zhCnLocale); //定義local中文
defineLocale("vn", viLocale);//定義local越文
defineLocale("en", enGbLocale);//定義local英文

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {

  actionCode:string;
  result: CarManageRecordDto[] = [];
  scarManageRecordDto: SCarManageRecordDto = new SCarManageRecordDto();
  deadlineNow = new Date(new Date().getTime() - 86400000); // now minus one day
  companyList: Company[] = [];
  departmentList: Department[] = [];

  constructor(
    public utility: Utility,
    private activeRouter: ActivatedRoute,
    private route: Router,
    private cmsService: CmsService
  ) {
    this.activeRouter.queryParams.subscribe((params) => {
      this.actionCode = params.actionCode;
      var urlParamEnum:UrlParamEnum = UrlParamEnum[this.actionCode];

      switch(urlParamEnum){
        /*if want keep condition after press previous page
        case UrlParamEnum.AddRecordSignature :{
          this.scarManageRecordDto = JSON.parse(params.sCondition);
  
          break;
        }
        */
        default :{
          this.scarManageRecordDto.signInDateS = this.utility.datepiper.transform(
            new Date(),
            "yyyy-MM-dd"
          );
          this.scarManageRecordDto.signInDateE = this.utility.datepiper.transform(
            new Date(),
            "yyyy-MM-dd"
          );
          break;
        }
      }
    });
  }
  ngOnInit() {

    this.getAllCompany();
    this.getAllDepartment();
    this.search();
  }

  edit(model: CarManageRecordDto) {
    var navigateTo = "/Transaction/AddRecordPage";
    var navigationExtras = {
      queryParams: {
        sCondition: JSON.stringify(this.scarManageRecordDto),
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
            model.signOutDate //已出廠的才需要控管
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
        this.setPagination(this.scarManageRecordDto,res.pagination);
        this.utility.spinner.hide();
        if (res.result.length < 1) {
          this.utility.alertify.confirm(
            "System Alert",
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
    model.isConfirm = "Y";

    this.cmsService.confirmRecord(model).subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "System Alert",
          "Confirm Success !",
          () => {}
        );
      },
      (error) => {
        this.utility.spinner.hide();
        this.utility.alertify.error(error);
      }
    );
  }
  viewPic(driverSign: string) {
    let dataUrl = "../assets/ReportPics/" + driverSign;
    window.open(dataUrl);
  }
  clearCondition() {
    this.scarManageRecordDto = new SCarManageRecordDto();
  }
  //due to JSON.parse(params.sCondition) so created this
  public setPagination(sCondition: Pagination,pagination: Pagination) {
    sCondition.currentPage = pagination.currentPage;
    sCondition.itemsPerPage = pagination.itemsPerPage;
    sCondition.totalItems = pagination.totalItems;
    sCondition.totalPages = pagination.totalPages;
  }
}
