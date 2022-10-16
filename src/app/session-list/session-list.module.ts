import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionListPageRoutingModule } from './session-list-routing.module';

import { SessionListPage } from './session-list.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    SessionListPageRoutingModule
  ],
  declarations: [SessionListPage]
})
export class SessionListPageModule {}
