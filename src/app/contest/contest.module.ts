import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContestPageRoutingModule } from './contest-routing.module';

import { ContestPage } from './contest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContestPageRoutingModule
  ],
  declarations: [ContestPage]
})
export class ContestPageModule {}
