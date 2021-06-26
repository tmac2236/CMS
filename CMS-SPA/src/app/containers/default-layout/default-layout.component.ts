import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "../../../environments/environment";
import { Utility } from "../../core/utility/utility";
import { User } from '../../core/_models/user';
import { AlertifyService } from "../../core/_services/alertify.service";
import { AuthService } from "../../core/_services/auth.service";
import { navItems } from "../../_nav";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  projectName = environment.projectName;
  public sidebarMinimized = false;
  public navItems = navItems;
  user: string;
  jwtHelper = new JwtHelperService();
  color:string ="";
  version:string ="";
  updateTime:string ="";

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    public utility: Utility
  ) {}
  ngOnInit() {
    const theToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.user = theToken['nameid'];
    this.version = theToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/version'];
    this.updateTime = theToken['birthdate'];
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  logout() {
    localStorage.removeItem("token");
    this.alertify.message("logged out");
    this.router.navigate([""]);
  }

}
