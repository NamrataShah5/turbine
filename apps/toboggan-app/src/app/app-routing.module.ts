import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/user',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'group',
    loadChildren: () =>
      import('./group/group.module').then((m) => m.GroupModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'assessment',
    loadChildren: () =>
      import('./assessment/assessment.module').then((m) => m.AssessmentModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'permission',
    loadChildren: () =>
      import('./permission/permission.module').then((m) => m.PermissionModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'prior-experiences',
    loadChildren: () =>
      import('./prior-experiences/prior-experiences.module').then((m) => m.PriorExperiencesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'content-management',
    loadChildren: () =>
      import('./content-management/content-management.module').then((m) => m.ContentManagementModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'content-management/:id',
    loadChildren: () =>
      import('./content-management/content-management.module').then((m) => m.ContentManagementModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'staff-profile/:id',
    loadChildren: () =>
      import('./staff-profile/staff-profile.module').then((m) => m.StaffProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'content-serve',
    loadChildren: () =>
      import('./content-serve/content-serve.module').then(
        (m) => m.ContentServeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'association-group',
    loadChildren: () =>
      import('./association-group/association-group.module').then((m) => m.AssociationGroupModule),
    canActivate: [AuthGuard],
  },
  // default page is user, change as we may see fit in the future
  { path: '**', redirectTo: '/user' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
