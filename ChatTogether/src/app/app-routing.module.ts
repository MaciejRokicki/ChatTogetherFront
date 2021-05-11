import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/rooms/room.module').then(x => x.RoomModule),
  },
  {
    path: 'conversation/:id',
    loadChildren: () => import('./pages/conversation/conversation.module').then(x => x.ConversationModule),
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
