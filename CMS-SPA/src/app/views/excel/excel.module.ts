// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompareComponent } from './compare/compare.component';

// Theme Routing
import { ExcelRoutingModule } from './excel-routing.module';
import { MacroComponent } from './macro/macro.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ExcelRoutingModule,
    WebcamModule,
  ],
  declarations: [CompareComponent, MacroComponent],
})
export class ExcelModule {}
