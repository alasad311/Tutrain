import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [

  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then((m) => m.HomePageModule),
          },
        ],
      },
      // {
      //   path: 'tab2',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../order-history/order-history.module').then(
      //           (m) => m.OrderHistoryPageModule
      //         ),
      //     },
      //   ],
      // },
      // {
      //   path: 'tab3',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../notification/notification.module').then(
      //           (m) => m.NotificationPageModule
      //         ),
      //     },
      //   ],
      // },
      // {
      //   path: 'tab4',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('..//profile/profile.module').then(
      //           (m) => m.ProfilePageModule
      //         ),
      //     },
      //   ],
      // },

      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
