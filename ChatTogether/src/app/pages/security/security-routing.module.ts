import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
    { 
        path: 'signin', 
        component: SigninComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    { //TODO: zrobic page dla signout
        path: 'signout',
        component: SignoutComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SecurityRoutingModule {}