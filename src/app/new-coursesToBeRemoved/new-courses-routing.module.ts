import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCoursesPage } from './new-courses.page';

const routes: Routes = [
  {
    path: '',
    component: NewCoursesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCoursesPageRoutingModule {}
