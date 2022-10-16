import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSessionPageRoutingModule } from './add-session-routing.module';

import { AddSessionPage } from './add-session.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddSessionPageRoutingModule
  ],
  declarations: [AddSessionPage]
})
export class AddSessionPageModule {}
