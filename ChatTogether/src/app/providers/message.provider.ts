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

    public getMessages(lastMessageDate: Date = new Date()): void {
        this.messageService.getMessages(lastMessageDate).pipe(
            tap((data: Message[]) => {
                data = data.filter((msg: Message) => {
                    if(msg.Time <= lastMessageDate)
                        return true;
                    return false;
                }).slice(-10);
                
                console.log(data);
                this.messages.unshift(...data);
                this.messages$.next(this.messages);
            })
        ).subscribe();
    }

    public sendMessage = (message: Message) => {
        this.messages.push(message);
        this.messages$.next(this.messages);
    }
}