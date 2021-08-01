import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomsComponent } from './home/rooms.component';
import { RoomsRoutingModule } from './rooms-routing.module';
import { MessageComponent } from 'src/app/components/message/message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomComponent } from './room/room.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        RoomsComponent,
        RoomComponent,
        MessageComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        RoomsRoutingModule,
        ReactiveFormsModule,
        MatTableModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    exports: []
})
export class RoomsModule { }