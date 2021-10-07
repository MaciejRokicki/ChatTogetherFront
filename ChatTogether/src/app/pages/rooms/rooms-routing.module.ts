import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'src/app/utils/guards/auth/authentication.guard';

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
        canActivate: [AuthenticationGuard]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoomsRoutingModule {}