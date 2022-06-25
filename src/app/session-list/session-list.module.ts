import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionListPageRoutingModule } from './session-list-routing.module';

import { SessionListPage } from './session-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionListPageRoutingModule
  ],
  declarations: [SessionListPage]
})
export class SessionListPageModule {}
