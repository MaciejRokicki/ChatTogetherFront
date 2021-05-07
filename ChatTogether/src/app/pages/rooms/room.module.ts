import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomComponent } from './home/room.component';
import { RoomRoutingModule } from './room-routing.module';
import { TableComponent } from 'src/app/components/table/table.component';

@NgModule({
    declarations: [
        RoomComponent,
        TableComponent
    ],
    imports: [
        CommonModule,
        RoomRoutingModule
    ],
    exports: []
})
export class RoomModule { }