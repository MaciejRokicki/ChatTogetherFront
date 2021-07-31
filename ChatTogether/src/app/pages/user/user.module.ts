import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { UserRoutingModule } from './user-routing.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { EditAboutMeDialogComponent } from './edit-about-me-dialog/edit-about-me-dialog.component';
import { ChangeNicknameDialogComponent } from './change-nickname-dialog/change-nickname-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        UserComponent,
        EditUserDialogComponent,
        EditAboutMeDialogComponent,
        ChangeNicknameDialogComponent
  ],
    imports: [
        FormsModule,
        CommonModule,
        UserRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule
    ],
    exports: []
})
export class UserModule { }