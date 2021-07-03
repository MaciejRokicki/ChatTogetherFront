import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    declarations: [
        UserComponent
  ],
    imports: [
        FormsModule,
        CommonModule,
        UserRoutingModule
    ],
    exports: []
})
export class UserModule { }