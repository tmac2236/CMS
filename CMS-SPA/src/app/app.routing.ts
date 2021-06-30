import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";
import { AuthGuard } from "./core/_guards/auth.guard";
import { AuthGuardRole } from "./core/_guards/auth.guard-role";
import { AddRecordPageComponent } from "./views/add-record-page/add-record-page.component";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { HomePageComponent } from "./views/home-page/home-page.component";
import { MaintainComponent } from "./views/maintain/maintain.component";
import { ReportComponent } from "./views/report/report.component";
import { SignaturePadComponent } from "./views/shared/signature-pad/signature-pad.component";
import { TestComponent } from "./views/test/test.component";

export const routes: Routes = [
  {
    path: "",
    //redirectTo: 'excel',
    //pathMatch: 'full',
    component: HomePageComponent,
  },
  {
    path: "404",
    component: P404Component,
  },
  {
    path: "500",
    component: P500Component,
  },
  {
    path: "ESignature",
    //canActivate: [AuthGuardRole],
    component: SignaturePadComponent,
    data: {
      roles: ['GUARD','GA'],
    },
  },
  {
    path: "Test",
    component: TestComponent,
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home",
    },
    children: [
      {
        path: "excel",
        loadChildren: () =>
          import("./views/excel/excel.module").then((m) => m.ExcelModule),
      },
      {
        path: "Maintain",
        loadChildren: () =>
          import("./views/maintain/maintain.module").then((m) => m.MaintainModule),
      },
      {
        path: "Report",
        loadChildren: () =>
          import("./views/report/report.module").then((m) => m.ReportModule),
      },
      {
        path: "Transaction",
        loadChildren: () =>
          import("./views/add-record-page/transaction.module").then((m) => m.TransactionModule),
      },
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
