import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/components/shared/shared.module';

import { MessageComponent } from './message.component';
import { MessageTimeConverterPipe } from 'src/app/utils/pipes/messageTimeConverter';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MessageFileComponent } from '../message-file/message-file.component';
import { DeleteMessageDialogComponent } from '../delete-message-dialog/delete-message-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        MessageComponent,
        MessageFileComponent,
        MessageTimeConverterPipe,
        DeleteMessageDialogComponent
    ],
    imports: [
        RouterModule,
        SharedModule,
        MatTooltipModule,
        MatDialogModule
    ],
    exports: [
        MessageComponent
    ]
})
export class MessageModule { }