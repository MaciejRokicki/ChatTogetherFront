import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { SecurityRoutingModule } from './security-routing.module';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';

@NgModule({
    declarations: [
        SignupComponent,
        SigninComponent,
        SignoutComponent
    ],
    imports: [
        CommonModule,
        SecurityRoutingModule,
        ReactiveFormsModule
    ],
    exports: []
})
export class SecurityModule { }