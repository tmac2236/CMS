import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardRole } from "../../core/_guards/auth.guard-role";
import { MaintainComponent } from "./maintain.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Maintain',
    },
    children: [
      {
        path: '',
        redirectTo: 'Maintain',
      },
      {
        path: "Maintain",
        canActivate: [AuthGuardRole],
        component: MaintainComponent,
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
