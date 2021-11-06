import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './utils/guards/auth/authentication.guard';
import { ModeratorGuard } from './utils/guards/auth/moderator.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/rooms/rooms.module').then(x => x.RoomsModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'security',
    loadChildren: () => import('./pages/security/security.module').then(x => x.SecurityModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(x => x.UsersModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'blocked-users',
    loadChildren: () => import('./pages/blocked-users/blocked-users.module').then(x => x.BlockedUsersModule),
    canActivate: [ModeratorGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
