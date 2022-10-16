import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackRequestPageRoutingModule } from './track-request-routing.module';

import { TrackRequestPage } from './track-request.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    TrackRequestPageRoutingModule
  ],
  declarations: [TrackRequestPage]
})
export class TrackRequestPageModule {}
