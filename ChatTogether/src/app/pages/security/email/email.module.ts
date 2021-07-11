import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { EmailRoutingModule } from './email-routing.module';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ChangeEmailComponent } from './change-email/change-email.component';

@NgModule({
    declarations: [ 
        ConfirmEmailComponent,
        ChangeEmailComponent
  ],
    imports: [
        CommonModule,
        EmailRoutingModule,
        ReactiveFormsModule
    ],
    exports: []
})
export class EmailModule { }