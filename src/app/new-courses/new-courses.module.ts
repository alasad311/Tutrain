import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewCoursesPageRoutingModule } from './new-courses-routing.module';

import { NewCoursesPage } from './new-courses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewCoursesPageRoutingModule
  ],
  declarations: [NewCoursesPage]
})
export class NewCoursesPageModule {}
