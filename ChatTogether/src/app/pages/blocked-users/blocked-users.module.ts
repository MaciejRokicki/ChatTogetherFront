import { NgModule } from '@angular/core';

import { BlockedUsersRoutingModule } from './blocked-users-routing.module';

import { BlockedUsersComponent } from './home/blocked-users.component';

import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        BlockedUsersComponent,
    ],
    imports: [
        BlockedUsersRoutingModule,
        SharedModule,
        MatTableModule,
        MatDialogModule,
    ],
    exports: []
})
export class BlockedUsersModule { }