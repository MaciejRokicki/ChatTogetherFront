import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    declarations: [
        UserComponent
  ],
    imports: [
        FormsModule,
        CommonModule,
        UserRoutingModule,
        ReactiveFormsModule
    ],
    exports: []
})
export class UserModule { }