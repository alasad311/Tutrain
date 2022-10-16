import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportUserPageRoutingModule } from './report-user-routing.module';

import { ReportUserPage } from './report-user.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    ReportUserPageRoutingModule
  ],
  declarations: [ReportUserPage]
})
export class ReportUserPageModule {}
