import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSessionPageRoutingModule } from './edit-session-routing.module';

import { EditSessionPage } from './edit-session.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditSessionPageRoutingModule
  ],
  declarations: [EditSessionPage]
})
export class EditSessionPageModule {}
