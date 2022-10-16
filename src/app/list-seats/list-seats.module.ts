import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListSeatsPageRoutingModule } from './list-seats-routing.module';

import { ListSeatsPage } from './list-seats.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    ListSeatsPageRoutingModule
  ],
  declarations: [ListSeatsPage]
})
export class ListSeatsPageModule {}
