import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionListPage } from './session-list.page';

const routes: Routes = [
  {
    path: '',
    component: SessionListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionListPageRoutingModule {}
