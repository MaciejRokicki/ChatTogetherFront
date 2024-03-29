import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './home/users.component';

import { UserComponent } from './user/user.component';

const routes: Routes = [
    { 
        path: '', 
        component: UsersComponent,
    },
    { 
        path: ':nickname', 
        component: UserComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}