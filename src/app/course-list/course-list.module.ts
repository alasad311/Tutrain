import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseListPageRoutingModule } from './course-list-routing.module';

import { CourseListPage } from './course-list.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    CourseListPageRoutingModule
  ],
  declarations: [CourseListPage]
})
export class CourseListPageModule {}
