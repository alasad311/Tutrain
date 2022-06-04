import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookTutorPage } from './book-tutor.page';

const routes: Routes = [
  {
    path: '',
    component: BookTutorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookTutorPageRoutingModule {}
