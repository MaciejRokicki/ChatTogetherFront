import { NgModule } from '@angular/core';

import { BlockedUsersRoutingModule } from './blocked-users-routing.module';

import { BlockedUsersComponent } from './home/blocked-users.component';

import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { UnblockConfirmationDialogComponent } from './unblock-confirmation-dialog/unblock-confirmation-dialog.component';
import { PaginatorModule } from 'src/app/components/paginator/paginator.module';

@NgModule({
    declarations: [
        BlockedUsersComponent,
        UnblockConfirmationDialogComponent,
    ],
    imports: [
        BlockedUsersRoutingModule,
        SharedModule,
        MatTableModule,
        MatDialogModule,
        PaginatorModule
    ],
    exports: []
})
export class BlockedUsersModule { }