import { NgModule } from '@angular/core';

import { RoomsRoutingModule } from './rooms-routing.module';

import { RoomsComponent } from './home/rooms.component';
import { MessageComponent } from 'src/app/components/message/message.component';
import { RoomComponent } from './room/room.component';

import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { EditRoomDialogComponent } from './edit-room-dialog/edit-room-dialog.component';
import { DeleteRoomDialogComponent } from './delete-room-dialog/delete-room-dialog.component';
import { CreateRoomDialogComponent } from './create-room-dialog/create-room-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageTimeConverterPipe } from 'src/app/utils/pipes/messageTimeConverter';

@NgModule({
    declarations: [
        RoomsComponent,
        RoomComponent,
        MessageComponent,
        EditRoomDialogComponent,
        DeleteRoomDialogComponent,
        CreateRoomDialogComponent,
        MessageTimeConverterPipe,
    ],
    imports: [
        RoomsRoutingModule,
        SharedModule,
        MatTableModule,
        MatDialogModule,
    ],
    exports: [
        MessageTimeConverterPipe
    ]
})
export class RoomsModule { }