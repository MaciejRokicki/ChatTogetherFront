import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './utils/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/rooms/rooms.module').then(x => x.RoomsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'security',
    loadChildren: () => import('./pages/security/security.module').then(x => x.SecurityModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then(x => x.UserModule),
    canActivate: [AuthGuard]
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
