import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPageRoutingModule } from './forgot-routing.module';

import { ForgotPage } from './forgot.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    ForgotPageRoutingModule
  ],
  declarations: [ForgotPage]
})
export class ForgotPageModule {}
