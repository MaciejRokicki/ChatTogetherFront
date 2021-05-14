import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversationComponent } from './home/conversation.component';
import { ConversationRoutingModule } from './conversation-routing.module';
import { MessageComponent } from 'src/app/components/message/message.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ConversationComponent,
        MessageComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        ConversationRoutingModule
    ],
    exports: []
})
export class ConversationModule { }