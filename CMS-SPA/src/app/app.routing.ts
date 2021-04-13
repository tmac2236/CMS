import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";
import { AuthGuard } from "./core/_guards/auth.guard";
import { AddRecordPageComponent } from "./views/add-record-page/add-record-page.component";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { HomePageComponent } from "./views/home-page/home-page.component";

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
    data: {
      title: "Page 404",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  {
    path: "AddRecordPage",
    component: AddRecordPageComponent,
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
      }
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
