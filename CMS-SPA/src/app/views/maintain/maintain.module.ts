// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Theme Routing
import { MaintainRoutingModule } from './maintain-routing.module';

import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { MaintainComponent } from './maintain.component';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from 'ngx-bootstrap/tabs';


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
  ],
  declarations: [MaintainComponent],
})
export class MaintainModule {}
