import { NgModule } from '@angular/core';

import { SecurityRoutingModule } from './security-routing.module';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';

import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
    declarations: [
        SignupComponent,
        SigninComponent,
        SignoutComponent
    ],
    imports: [
        SecurityRoutingModule,
        SharedModule,
    ],
    exports: []
})
export class SecurityModule { }