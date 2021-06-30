import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardRole } from "../../core/_guards/auth.guard-role";
import { ReportComponent } from "./report.component";


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Report',
    },
    children: [
      {
        path: '',
        redirectTo: 'Report',
      },
      {
        path: "Report",
        canActivate: [AuthGuardRole],
        component: ReportComponent,
        data: {
          roles: ['ADM','GUARD','GA'],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintainRoutingModule {}
