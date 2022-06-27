import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContestPage } from './contest.page';

const routes: Routes = [
  {
    path: '',
    component: ContestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContestPageRoutingModule {}
