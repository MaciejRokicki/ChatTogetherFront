import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

const routes: Routes = [
    { 
        path: 'confirm/:email/:token',
        component: ConfirmEmailComponent
    },
    {
        path: 'change/:email/:token',
        component: ChangeEmailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailRoutingModule {}