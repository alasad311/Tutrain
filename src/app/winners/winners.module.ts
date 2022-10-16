import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WinnersPageRoutingModule } from './winners-routing.module';

import { WinnersPage } from './winners.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    WinnersPageRoutingModule
  ],
  declarations: [WinnersPage]
})
export class WinnersPageModule {}
