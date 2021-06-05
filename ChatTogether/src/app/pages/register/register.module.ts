import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterComponent } from './home/register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        RegisterComponent,
    ],
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ReactiveFormsModule
    ],
    exports: []
})
export class RegisterModule { }