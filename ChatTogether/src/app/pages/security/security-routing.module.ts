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
    {
        path: 'signout',
        component: SignoutComponent
    },
    {
        path: 'password',
        loadChildren: () => import('./password/password.module').then(x => x.PasswordModule)
    },
    {
        path: 'email',
        loadChildren: () => import('./email/email.module').then(x => x.EmailModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SecurityRoutingModule {}