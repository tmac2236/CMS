import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UrlParamEnum } from "../../core/enum/urlParamEnum";
import { Utility } from "../../core/utility/utility";
import { Car } from "../../core/_models/car";
import { CarManageRecord } from "../../core/_models/car-manage-record";
import { Company } from "../../core/_models/company";
import { Department } from "../../core/_models/department";
import { CmsService } from "../../core/_services/cms.service";

@Component({
  selector: "app-maintain",
  templateUrl: "./maintain.component.html",
  styleUrls: ["./maintain.component.scss"],
})
export class MaintainComponent implements OnInit {
  //carList: Car[] = [];
  //companyList: Company[] = [];
  //departmentList: Department[] = [];

  public companyFormGroup: FormGroup;
  public companys: FormArray; // formArrayName

  public carFormGroup: FormGroup;
  public cars: FormArray; // formArrayName

  public departmentFormGroup: FormGroup;
  public departments: FormArray; // formArrayName
  public role : string;

  deadlineNow = new Date(new Date().getTime() - 7776000000); // now minus three months
  constructor(
    public utility: Utility,private cmsService: CmsService,
    private readonly fb: FormBuilder,private activeRouter: ActivatedRoute,
    private route: Router,
  ) {
    this.activeRouter.queryParams.subscribe((params) => {
      //this.role = params.role;
    });

    this.companyFormGroup = this.fb.group({
      companys: this.fb.array([]),
    });
    this.carFormGroup = this.fb.group({
      cars: this.fb.array([]),
    });
    this.departmentFormGroup = this.fb.group({
      departments: this.fb.array([]),
    });    
  }

  ngOnInit() {
    this.role = this.utility.getRole();
    console.log("Here is  : " + this.role);
    //debugger;
      this.getAllCarCompanyDepartment();
  }
  getAllCar() {
    this.utility.spinner.show();
    this.cmsService.getAllCarList().subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.carFormGroup = this.fb.group({
          cars: this.fb.array([]),
        });
        res.map((x) => {
          this.cars = this.getCarForm;
          this.cars.push(this.createCar(x.id, x.carSize));
        });
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
  getAllDepartment() {
    this.utility.spinner.show();
    this.cmsService.getAllDepartment().subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.departmentFormGroup = this.fb.group({
          departments: this.fb.array([]),
        });
        res.map((x) => {
          this.departments = this.getDepartmentForm;
          this.departments.push(this.createDepartment(x.id, x.departmentName));
        });
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
        this.companyFormGroup = this.fb.group({
          companys: this.fb.array([]),
        });
        res.map((x) => {
          //check is need warn
          if( new Date(x.createDate).getTime() > 
            new Date(this.deadlineNow).getTime()
          ){
            x.isWarn = true;
          }else{
            x.isWarn = false;
          }

          this.companys = this.getCompanyForm;
          let createDateStr = x.createDate.toString().replace("T"," ");
          this.companys.push(
            this.createCompany(x.id, x.companyName, x.companyDistance,createDateStr,x.isWarn)
          );
        });
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
        ///////////////Cars/////////////
        this.carFormGroup = this.fb.group({
          cars: this.fb.array([]),
        });
        let resCars = <Car[]>res[0];
        resCars.map((x) => {
          this.cars = this.getCarForm;
          //if role is GUARD isRead = true;
          if(this.role == 'GUARD' ){
            x.isRead = true;
          }          
          this.cars.push(this.createCar(x.id, x.carSize,x.isRead));
        });
        ///////////Companys///////////
        this.companyFormGroup = this.fb.group({
          companys: this.fb.array([]),
        });
        let resCompanys = <Company[]>res[1];
        resCompanys.map((x) => {
          //check is need warn
          if( new Date(x.createDate).getTime() > 
            new Date(this.deadlineNow).getTime()
          ){
            x.isWarn = true;
          }else{
            x.isWarn = false;
          }
          //if role is GUARD isRead = true;
          if(this.role == 'GUARD' ){
            x.isRead = true;
          }
          this.companys = this.getCompanyForm;
          let createDateStr = x.createDate.toString().replace("T"," ");
          this.companys.push(
            this.createCompany(x.id, x.companyName, x.companyDistance,createDateStr,x.isWarn,x.isRead)
          );
        });
        ///////////Department///////////
        this.departmentFormGroup = this.fb.group({
          departments: this.fb.array([]),
        });
        let resDepartments = <Department[]>res[2];
        resDepartments.map((x) => {
          //if role is GUARD isRead = true;
          if(this.role == 'GUARD' ){
            x.isRead = true;
          }
          this.departments = this.getDepartmentForm;
          this.departments.push(this.createDepartment(x.id, x.departmentName,x.isRead));
        });

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
  ////// Company Form control ///////
  get getCompanyForm(): FormArray {
    return this.companyFormGroup.get("companys") as FormArray;
  }
  createCompany(
    id?: number,
    companyName?: string,
    companyDistance?: string,
    createDate?: string,
    isWarn?: boolean,
    isRead?: boolean
  ): FormGroup {
    return this.fb.group({
      id: id,
      companyName: companyName,
      companyDistance: companyDistance,
      createDate:createDate,
      isWarn:isWarn,
      isRead: isRead
    });
  }
  addEmptyCompany(): void {    
    this.companys = this.getCompanyForm;
    this.companys.insert(0,this.createCompany());
  }
  //i: index of the list
  removeCompany(i: number) {
    console.log(this.companys.at(i));
    this.companys.removeAt(i);
  }
  submitCompanyList() {
    let companyList = [];
    let companysForm = this.utility.getChangedProperties(this.companys);
    companysForm.map((companyForm) => {

      let company = new Company();
      if(companyForm.value.id){
        company.id = companyForm.value.id;
      }else{
        company.id = UrlParamEnum.NullCodeNumber;
      }
      company.companyName = companyForm.value.companyName;
      company.companyDistance = companyForm.value.companyDistance;
      company.createDate = companyForm.value.createDate;
      company.isWarn = companyForm.value.isWarn;
      companyList.push(company);
    });
    this.cmsService.addOrUpdateCompanyList(companyList).subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "System Alert",
          "Save Success !",
          () => {
            if(this.role =='ADM'){
              this.getAllCompany();
            }
          }); 
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
  ////// Company Form control ///////

  ////// Car Form control ///////
  get getCarForm(): FormArray {
    return this.carFormGroup.get("cars") as FormArray;
  }
  createCar(id?: number, carSize?: string, isRead?: boolean): FormGroup {
    return this.fb.group({
      id: id,
      carSize: carSize,
      isRead: isRead
    });
  }
  addEmptyCar(): void {
    this.cars = this.getCarForm;
    this.cars.insert(0,this.createCar());
  }
  //i: index of the list
  removeCar(i: number) {
    console.log(this.cars.at(i));
    this.cars.removeAt(i);
  }
  submitCarList(){
    let carList = [];
    let carsForm = this.utility.getChangedProperties(this.cars);
    carsForm.map((carForm) => {

      let car = new Car();
      if(carForm.value.id){
        car.id = carForm.value.id;
      }else{
        car.id = UrlParamEnum.NullCodeNumber;
      }
      car.carSize = carForm.value.carSize;
      carList.push(car);
    });
    this.cmsService.addOrUpdateCarList(carList).subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "System Alert",
          "Save Success !",
          () => {
            if(this.role =='ADM'){
              this.getAllCar();
            }
          }); 
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
  ////// Car Form control ///////


  ////// Department Form control ///////
  get getDepartmentForm(): FormArray {
    return this.departmentFormGroup.get("departments") as FormArray;
  }
  createDepartment(id?: number, departmentName?: string, isRead?: boolean): FormGroup {
    return this.fb.group({
      id: id,
      departmentName: departmentName,
      isRead: isRead
    });
  }
  addEmptyDepartment(): void {
    this.departments = this.getDepartmentForm;
    this.departments.insert(0,this.createDepartment());
  }
  //i: index of the list
  removeDepartment(i: number) {
    console.log(this.departments.at(i));
    this.departments.removeAt(i);
  }
  submitDepartmentList() {
    let departmentList = [];
    let departmentsForm = this.utility.getChangedProperties(this.departments);
    departmentsForm.map((departmentForm) => {

      let department = new Department();
      if(departmentForm.value.id){
        department.id = departmentForm.value.id;
      }else{
        department.id = UrlParamEnum.NullCodeNumber;
      }
      department.departmentName = departmentForm.value.departmentName;
      departmentList.push(department);
    });
    this.cmsService.addOrUpdateDepartmentList(departmentList).subscribe(
      (res) => {
        this.utility.spinner.hide();
        this.utility.alertify.confirm(
          "System Alert",
          "Save Success !",
          () => {
            if(this.role =='ADM'){
              this.getAllDepartment();
            } 
          }); 
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
  ////// Car Form control ///////

}
