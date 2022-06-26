import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorProflePage } from './tutor-profle.page';

const routes: Routes = [
  {
    path: '',
    component: TutorProflePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorProflePageRoutingModule {}
