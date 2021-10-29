import { NgModule } from '@angular/core';

import { RoomsRoutingModule } from './rooms-routing.module';

import { RoomsComponent } from './home/rooms.component';
import { RoomComponent } from './room/room.component';

import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { EditRoomDialogComponent } from './edit-room-dialog/edit-room-dialog.component';
import { DeleteRoomDialogComponent } from './delete-room-dialog/delete-room-dialog.component';
import { CreateRoomDialogComponent } from './create-room-dialog/create-room-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageModule } from 'src/app/components/messages/message/message.module';
import { MessageFileToUploadComponent } from 'src/app/components/messages/message-file-to-upload/message-file-to-upload.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        RoomsComponent,
        RoomComponent,
        EditRoomDialogComponent,
        DeleteRoomDialogComponent,
        CreateRoomDialogComponent,
        MessageFileToUploadComponent
    ],
    imports: [
        RoomsRoutingModule,
        SharedModule,
        MatTableModule,
        MatDialogModule,
        MessageModule,
        MatTooltipModule
    ],
    exports: []
})
export class RoomsModule { }