import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorProflePageRoutingModule } from './tutor-profle-routing.module';

import { TutorProflePage } from './tutor-profle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorProflePageRoutingModule
  ],
  declarations: [TutorProflePage]
})
export class TutorProflePageModule {}
