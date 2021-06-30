import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddRecordPageComponent } from "./add-record-page.component";


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Transaction',
    },
    children: [
      {
        path: '',
        redirectTo: 'AddRecordPage',
      },
      {
        path: "AddRecordPage",
        //canActivate: [AuthGuardRole],
        component: AddRecordPageComponent,
        data: {
          roles: ['GUARD','GA'],
        },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionRoutingModule {}
