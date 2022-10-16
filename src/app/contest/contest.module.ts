import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContestPageRoutingModule } from './contest-routing.module';

import { ContestPage } from './contest.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    ContestPageRoutingModule
  ],
  declarations: [ContestPage]
})
export class ContestPageModule {}
