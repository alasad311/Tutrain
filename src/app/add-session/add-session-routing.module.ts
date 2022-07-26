import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSessionPage } from './add-session.page';

const routes: Routes = [
  {
    path: '',
    component: AddSessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSessionPageRoutingModule {}
