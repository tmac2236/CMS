import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UrlParamEnum } from "../../core/enum/urlParamEnum";
import { Utility } from "../../core/utility/utility";
import { Car } from "../../core/_models/car";
import { CarManageRecord } from "../../core/_models/car-manage-record";
import { Company } from "../../core/_models/company";
import { Department } from "../../core/_models/department";
import { Pagination } from "../../core/_models/pagination";
import { CmsService } from "../../core/_services/cms.service";

@Component({
  selector: "app-add-record-page",
  templateUrl: "./add-record-page.component.html",
  styleUrls: ["./add-record-page.component.scss"],
})
export class AddRecordPageComponent implements OnInit {

  model: CarManageRecord = new CarManageRecord();
  carList: Car[] = [];
  companyList: Company[] = [];
  departmentList: Department[] =[];
  isValidinDB:boolean = false;
  actionCode:string;
  sCondition: Pagination;//search condition from privious page

  constructor(
    public utility: Utility,private activeRouter: ActivatedRoute,private route: Router,private cmsService:CmsService) {
    this.activeRouter.queryParams.subscribe((params) => {

      this.actionCode = params.actionCode;
      var urlParamEnum:UrlParamEnum = UrlParamEnum[this.actionCode];

      switch(urlParamEnum){
        case UrlParamEnum.Signature :{
          this.model.signInDate = params.signInDate;
          this.model.licenseNumber = params.licenseNumber;
          this.getTheRecord();
          break;
        }
        case UrlParamEnum.Report :{
          this.model.signInDate = params.signInDate;
          this.model.licenseNumber = params.licenseNumber;
          this.sCondition = params.sCondition;
          this.getTheRecord();
          break;
        }
      }

    });
  }

  ngOnInit(): void {
    //this.getAllCarList();
    //this.getAllCompany();
    //this.getAllDepartment();
    this.getAllCarCompanyDepartment();
  }

  signature() {
    if(!this.checkFormValidate("signOut")) {
      this.utility.alertify.confirm(
        "System Alert",
        "Please select Goods Name、Good Count、Guard Name !",
        () => {});  
        return;
    }
    var navigateTo = "/ESignature";
    var navigationExtras = {
      queryParams: {
        signInDate: this.model.signInDate,
        licenseNumber: this.model.licenseNumber,
        actionCode: UrlParamEnum.Report,
      },
      skipLocationChange: true,
    };
    this.route.navigate([navigateTo], navigationExtras);
  }

  getAllCarList(){
    this.utility.spinner.show();
    this.cmsService.getAllCarList().subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.carList = res;
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
  getAllDepartment(){
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
  getAllCompany(){
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
  getAllCarCompanyDepartment(){
    this.utility.spinner.show();
    this.cmsService.getAllCarCompanyDepartment().subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.carList = <Car[]>res[0];
        this.companyList =<Company[]>res[1];
        this.departmentList = <Department[]>res[2];
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
  save(event: any){
    if(!this.checkFormValidate("save")) {
      this.utility.alertify.confirm(
        "System Alert",
        "Please select Company、Department、Car !",
        () => { });  
        return;
    } 
    event.target.disabled = true;
    this.utility.spinner.show();
    this.cmsService.addRecord(this.model).subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "System Alert",
          "Add Success !",
          () => { 
            this.model = new CarManageRecord();
           });  
      },
      (error) => {
        this.utility.spinner.hide();
        this.utility.alertify.error(error);
      }
    );
  }
  edit(){
    if((!this.checkFormValidate("edit"))&& (this.model.isConfirm != null)) {
      this.utility.alertify.confirm(
        "System Alert",
        "Please select Goods Name、Good Count、Guard Name !",
        () => {});  
        return;
    }
    this.utility.spinner.show();
    this.cmsService.editRecord(this.model).subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "System Alert",
          "Edit Success !",
          () => { 
            this.model = res;
            this.isValidinDB = true;
          });  
      },
      (error) => {
        this.utility.spinner.hide();
        this.utility.alertify.error(error);
      }
    );
  }
  signOut(){
    if(!this.checkFormValidate("signOut")) {
      this.utility.alertify.confirm(
        "System Alert",
        "Please select Company、Department、Car、Goods Name、Good Count、Guard Name !",
        () => {});  
        return;
    }
    this.utility.spinner.show();
    this.cmsService.signOutRecord(this.model).subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "System Alert",
          "SignOut Success !",
          () => { 
            this.model = res; });  
      },
      (error) => {
        this.utility.spinner.hide();
        this.utility.alertify.error(error);
      }
    );
  }
  getTheRecord(){
    this.utility.spinner.show();
      this.cmsService.getTheRecord(this.model).subscribe(
        (res) => {
          this.utility.spinner.hide();
          this.model = res;
          this.isValidinDB = this.checkFormValidate("edit");
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
  getLastRecord(){
    console.log(this.model);
    this.utility.spinner.show();
      this.cmsService.getLastRecord(this.model).subscribe(
        (res) => {
          this.utility.spinner.hide();
          if(res == null){
            console.log("The license :" +this.model.licenseNumber + " Number has no record.");
            return;
          } 
          this.model.companyId = res.companyId;
          this.model.plateNumber = res.plateNumber;
          this.model.driverName = res.driverName;
          this.model.licenseNumber = res.licenseNumber;
          //this.model.tempNumber = res.tempNumber;
          //this.model.carTempNumber = res.carTempNumber;
          this.model.signInReason = res.signInReason;
          //this.model.goodsName = res.goodsName;   12/4 Emma cancel
          //this.model.goodsCount = res.goodsCount; 12/4 Emma cancel
          this.model.departmentId = res.departmentId;
          this.model.contactPerson = res.contactPerson;
          this.model.sealNumber = res.sealNumber;
          this.model.guardName = res.guardName;
          this.model.carId = res.carId;
          //this.model.isConfirm = res.isConfirm;
          this.model.memo = res.memo;
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
  //isValid
  checkFormValidate(type:string){
    let flag = false;
    if(this.model.companyId && this.model.carId && this.model.departmentId  ){
      if(type =="signOut" || type =="edit"){ //SignOut 額外卡控
        if (this.model.goodsName && this.model.goodsCount  && this.model.guardName ){
          flag = true;
        }
      }else{
        flag = true;
      }
    }
    return flag;
  }
  toReport(){
    var navigateTo = "/Report";
    var navigationExtras = {
      queryParams: {
        sCondition:this.sCondition,
        actionCode: UrlParamEnum.AddRecordSignature
      },
      skipLocationChange: true,
    };
    this.route.navigate([navigateTo], navigationExtras);
  }
}
