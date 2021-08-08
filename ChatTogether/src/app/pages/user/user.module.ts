import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';

import { UserComponent } from './user/user.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { EditAboutMeDialogComponent } from './edit-about-me-dialog/edit-about-me-dialog.component';
import { ChangeNicknameDialogComponent } from './change-nickname-dialog/change-nickname-dialog.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
    declarations: [
        UserComponent,
        EditUserDialogComponent,
        EditAboutMeDialogComponent,
        ChangeNicknameDialogComponent
  ],
    imports: [
        UserRoutingModule,
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule
    ],
    exports: []
})
export class UserModule { }