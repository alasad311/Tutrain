import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSessionPage } from './edit-session.page';

const routes: Routes = [
  {
    path: '',
    component: EditSessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSessionPageRoutingModule {}
