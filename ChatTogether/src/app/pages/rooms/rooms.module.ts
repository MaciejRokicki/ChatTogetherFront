import { NgModule } from '@angular/core';

import { RoomsRoutingModule } from './rooms-routing.module';

import { RoomsComponent } from './home/rooms.component';
import { MessageComponent } from 'src/app/components/message/message.component';
import { RoomComponent } from './room/room.component';

import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
    declarations: [
        RoomsComponent,
        RoomComponent,
        MessageComponent
    ],
    imports: [
        RoomsRoutingModule,
        SharedModule,
        MatTableModule,
    ],
    exports: []
})
export class RoomsModule { }