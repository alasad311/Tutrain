import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSessionPageRoutingModule } from './add-session-routing.module';

import { AddSessionPage } from './add-session.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSessionPageRoutingModule
  ],
  declarations: [AddSessionPage]
})
export class AddSessionPageModule {}
