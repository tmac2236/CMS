import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BsDropdownConfig } from "ngx-bootstrap/dropdown";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "../../../environments/environment";
import { AlertifyService } from "../../core/_services/alertify.service";
import { AuthService } from "../../core/_services/auth.service";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class HomePageComponent implements OnInit {
  projectName = environment.projectName;
  loginModel: any = {};
  photoUrl: string;
  param1: string;
  param2: string;
  jwtHelper = new JwtHelperService();

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit() {

  }

  loginSystem() {
    this.spinner.show();
    this.authService.login(this.loginModel).subscribe(
      (next) => {
        let role = this.jwtHelper.decodeToken(localStorage.getItem('token'))["role"];
        this.spinner.hide();
        this.alertify.success("Logined in sucessed");
        if(role =="ADM"){
          this.router.navigate(["/Report"]);
        }else if (role =="GA"){
          this.router.navigate(["/Report"]);
        }else if (role =="GUARD"){
          this.router.navigate(["/AddRecordPage"]);
        }

      
      },
      (error) => {
        this.spinner.hide();
        this.alertify.error(error);
        this.router.navigate([""]);
      }
    );
  }

}
