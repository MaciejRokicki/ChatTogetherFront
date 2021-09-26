import { NgModule } from '@angular/core';

import { UsersRoutingModule } from './users-routing.module';

import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { EditAboutMeDialogComponent } from './edit-about-me-dialog/edit-about-me-dialog.component';
import { ChangeNicknameDialogComponent } from './change-nickname-dialog/change-nickname-dialog.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { BlockUserDialogComponent } from './block-user-dialog/block-user-dialog.component';
import { UsersComponent } from './home/users.component';
import { UserComponent } from './user/user.component';
import { ChangeRoleDialogComponent } from './change-role-dialog/change-role-dialog.component';
import { PaginatorModule } from 'src/app/components/paginator/paginator.module';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
    declarations: [
        UsersComponent,
        UserComponent,
        BlockUserDialogComponent,
        EditUserDialogComponent,
        EditAboutMeDialogComponent,
        ChangeNicknameDialogComponent,
        ChangeRoleDialogComponent,
  ],
    imports: [
        UsersRoutingModule,
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatDividerModule,
        MatTableModule,
        MatSelectModule,
        PaginatorModule
    ],
    exports: []
})
export class UsersModule { }