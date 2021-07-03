import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomsComponent } from './home/rooms.component';
import { RoomsRoutingModule } from './rooms-routing.module';
import { TableComponent } from 'src/app/components/table/table.component';
import { MessageComponent } from 'src/app/components/message/message.component';
import { FormsModule } from '@angular/forms';
import { RoomComponent } from './room/room.component';

@NgModule({
    declarations: [
        RoomsComponent,
        TableComponent,
        RoomComponent,
        MessageComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        RoomsRoutingModule
    ],
    exports: []
})
export class RoomsModule { }