// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Theme Routing
import { MaintainRoutingModule } from './report-routing.module';

import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ReportComponent } from './report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaintainRoutingModule,//router
    TranslateModule,
    TabsModule,
    NgSelectModule,   // ng-select
    PaginationModule, //use for sheet
  ],
  declarations: [ReportComponent],
})
export class ReportModule {}
