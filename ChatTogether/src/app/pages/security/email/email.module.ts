import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailRoutingModule } from './email-routing.module';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [ 
        ConfirmEmailComponent,
        ChangeEmailComponent
  ],
    imports: [
        FormsModule,
        CommonModule,
        EmailRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    exports: []
})
export class EmailModule { }