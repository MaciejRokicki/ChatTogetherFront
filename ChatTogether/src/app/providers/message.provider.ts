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

    public getMessages(): void {
        this.messageService.getMessages().pipe(
            tap((data: Message[]) => {
                this.messages = data;
                this.messages$.next(data);
            })
        ).subscribe();
    }

    public sendMessage = (message: Message) => {
        this.messages.push(message);
        this.messages$.next(this.messages);
    }
}