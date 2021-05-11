import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UrlParamEnum } from "../../core/enum/urlParamEnum";
import { Utility } from "../../core/utility/utility";
import { CarManageRecordDto } from "../../core/_models/car-manage-record-dto";
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

  ngOnInit() {
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
        this.result = res.result.map((model) =>{
          
          if(new Date(model.signInDate).getTime() < new Date(this.deadlineNow).getTime()){
            model.isDisplay = UrlParamEnum.NoNumber;
          }else{
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
    this.utility.exportFactory(url, "CMS_Report",this.scarManageRecordDto);
  }
}
