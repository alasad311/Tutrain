import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './service/Auth/auth-guard.service';
const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    data: { authGuardRedirect: 'welcome' },
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'forgot',
    loadChildren: () => import('./forgot/forgot.module').then( m => m.ForgotPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'details/users',
    loadChildren: () => import('./details/users/users.module').then( m => m.UsersPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'details/courses',
    loadChildren: () => import('./details/courses/courses.module').then( m => m.CoursesPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'report-user',
    loadChildren: () => import('./report-user/report-user.module').then( m => m.ReportUserPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'book-tutor',
    loadChildren: () => import('./book-tutor/book-tutor.module').then( m => m.BookTutorPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then( m => m.FaqPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'invite-friend',
    loadChildren: () => import('./invite-friend/invite-friend.module').then( m => m.InviteFriendPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'payment-history',
    loadChildren: () => import('./payment-history/payment-history.module').then( m => m.PaymentHistoryPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'track-request',
    loadChildren: () => import('./track-request/track-request.module').then( m => m.TrackRequestPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'session-list',
    loadChildren: () => import('./session-list/session-list.module').then( m => m.SessionListPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'details/session',
    loadChildren: () => import('./details/session/session.module').then( m => m.SessionPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'tutor-profle',
    loadChildren: () => import('./tutor-profle/tutor-profle.module').then( m => m.TutorProflePageModule),
    // canActivate: [AuthGuardService],
  },
  {
    path: 'contest/:id',
    loadChildren: () => import('./contest/contest.module').then( m => m.ContestPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'subscription',
    loadChildren: () => import('./subscription/subscription.module').then( m => m.SubscriptionPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'category/:id',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'winners',
    loadChildren: () => import('./winners/winners.module').then( m => m.WinnersPageModule),
    canActivate: [AuthGuardService],

  },
  {
    path: 'course-list',
    loadChildren: () => import('./course-list/course-list.module').then( m => m.CourseListPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit-session',
    loadChildren: () => import('./edit-session/edit-session.module').then( m => m.EditSessionPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'list-seats',
    loadChildren: () => import('./list-seats/list-seats.module').then( m => m.ListSeatsPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'add-session',
    loadChildren: () => import('./add-session/add-session.module').then( m => m.AddSessionPageModule),
    canActivate: [AuthGuardService],
  },  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
