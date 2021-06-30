// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Theme Routing
import { TransactionRoutingModule } from './transaction-routing.module';

import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddRecordPageComponent } from './add-record-page.component';




@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TransactionRoutingModule,//router
    TranslateModule,
    TabsModule,
    NgSelectModule,   // ng-select
  ],
  declarations: [AddRecordPageComponent],
})
export class TransactionModule {}
