import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlockedUsersComponent } from './home/blocked-users.component';

const routes: Routes = [
    { 
        path: '', 
        component: BlockedUsersComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlockedUsersRoutingModule {}