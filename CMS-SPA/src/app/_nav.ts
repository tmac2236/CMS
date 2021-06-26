import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { AuthService } from './core/_services/auth.service';

export const navItems: INavData[] = [];

@Injectable({
  providedIn: 'root'  // <- ADD THIS
})
export class NavItem {

  navItems: INavData[] = [];
  theUserRoles = this.authService.getUserRole().toUpperCase();
  constructor(private authService: AuthService){}

  getNav() {
    //grandFather
    this.navItems = [];

    //#region "1navMaintain"
    //father
    const navMaintain = {
      name: '1. Maintain',
      icon: 'fa fa-cogs',
      children: []
    };
    //children
    const navMaintain_Maintain = {
      name: '1.1 Maintain',
      url: '/Maintain',
      class: 'menu-margin',
    };

    //children -> father
    if (this.theUserRoles.includes("ADM") || this.theUserRoles.includes("GA")|| this.theUserRoles.includes("GUARD")) {
      navMaintain.children.push(navMaintain_Maintain);
    }

    //father -> grandfather
    if (navMaintain.children.length > 0) {
      this.navItems.push(navMaintain);
    }
    //#endregion  "1navMaintain"

    //#region "2navTransaction"
    //father
    const navTransaction = {
      name: '2. Transaction',
      icon: 'fa fa-balance-scale',
      children: []
    };
    //children
    const navTransaction_AddRecordPage = {
      name: '2.1 AddRecord',
      url: '/AddRecordPage',
      class: 'menu-margin',
    };

    //children -> father
    if (this.theUserRoles.includes("GUARD")) {
      navTransaction.children.push(navTransaction_AddRecordPage);
    }

    //father -> grandfather
    if (navTransaction.children.length > 0) {
      this.navItems.push(navTransaction);
    }
    //#endregion  "2navTransaction"

    //#region "4navReport"
    //father
    const navReport = {
      name: '4. Report',
      icon: 'fa fa-newspaper-o',
      children: []
    };
    //children
    const navReport_Report = {
      name: '4.1 Report',
      url: '/Report',
      class: 'menu-margin',
    };

    //children -> father
    if (this.theUserRoles.includes("ADM") || this.theUserRoles.includes("GA")|| this.theUserRoles.includes("GUARD")) {
      navReport.children.push(navReport_Report);
    }

    //father -> grandfather
    if (navReport.children.length > 0) {
      this.navItems.push(navReport);
    }
    //#endregion  "navReport"

    return this.navItems;
  }
}
