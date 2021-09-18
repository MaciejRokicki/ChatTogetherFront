import { NgModule } from '@angular/core';

import { SecurityRoutingModule } from './security-routing.module';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';

import { SharedModule } from 'src/app/components/shared/shared.module';
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [
        SignupComponent,
        SigninComponent,
        SignoutComponent
    ],
    imports: [
        SecurityRoutingModule,
        SharedModule
    ],
    exports: [],
    providers: [
        DatePipe,
    ]
})
export class SecurityModule { }