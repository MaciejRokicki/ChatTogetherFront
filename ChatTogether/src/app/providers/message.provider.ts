import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";

import { Message } from "../entities/message";
import { MessageService } from "../services/message.service";

@Injectable({
    providedIn: 'root'
})

export class MessageProvider {

    public messages$ = new BehaviorSubject<Message[]>([])
    public messages: Message[] = []

    constructor(private messageService: MessageService) { }

    public getMessages(lastMessageDate: Date = new Date(), messagesCount: number = 20): void {
        this.messageService.getMessages(lastMessageDate).pipe(
            tap((data: Message[]) => {
                data = data.filter((msg: Message) => {
                    if(msg.Time <= lastMessageDate)
                        return true;
                    return false;
                }).slice(-messagesCount);

                this.messages.unshift(...data);
                this.messages$.next(this.messages);
            })
        ).subscribe();
    }

    public sendMessage = (message: Message): void => {
        this.messages.push(message);
        this.messages$.next(this.messages);
    }
}