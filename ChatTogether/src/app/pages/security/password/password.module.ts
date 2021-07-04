import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordRoutingModule } from './password-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
    declarations: [
        ForgotPasswordComponent,
        ChangePasswordComponent
    ],
    imports: [
        CommonModule,
        PasswordRoutingModule,
        ReactiveFormsModule
    ],
    exports: []
})
export class PasswordModule { }