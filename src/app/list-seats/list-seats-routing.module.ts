import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListSeatsPage } from './list-seats.page';

const routes: Routes = [
  {
    path: '',
    component: ListSeatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListSeatsPageRoutingModule {}
