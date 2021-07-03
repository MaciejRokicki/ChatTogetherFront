import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/utils/guards/auth/auth.guard';

import { RoomsComponent } from './home/rooms.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
    { 
        path: '', 
        component: RoomsComponent,
    },
    {
        path: 'room/:id',
        component: RoomComponent,
        canActivate: [AuthGuard]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoomsRoutingModule {}