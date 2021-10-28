import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageFile } from '../entities/Message/messageFile';

@Injectable({
    providedIn: 'root'
})
export class MessageFileOverlayService {
    public messageFile: BehaviorSubject<MessageFile> = new BehaviorSubject<MessageFile>(null);

    public open(messageFile: MessageFile): void {
        this.messageFile.next(messageFile);
    }

    public close(): void {
        this.messageFile.next(null);
    }
}