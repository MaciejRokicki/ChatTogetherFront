import { Injectable } from "@angular/core";

import { BehaviorSubject, of } from "rxjs";
import { tap } from "rxjs/operators";

import { Message } from "../entities/message";
import { Hub } from "../Hub";
import { MessageService } from "../services/message.service";
import { DateConverter } from "../utils/DateConverter";

@Injectable({
    providedIn: 'root'
})
export class MessageProvider {

    //TODO: pomyslec nad trzymanie wszystkich wiadomosci w BS
    messages = new BehaviorSubject<Message[]>([])

    constructor(
        private messageService: MessageService,
        private hub: Hub
        ) { }

    public getMessages(roomId: number, size: number = 20, lastMessageDate: Date = new Date()): void {
        this.messageService.getMessages(roomId, size, DateConverter.DateToUTC(lastMessageDate)).pipe(
            tap((messages: Message[]) => {
                this.messages.next([...messages, ...this.messages.getValue()]);
            })
        ).subscribe();
    }

    public clearMessages(): void {
        this.messages = new BehaviorSubject<Message[]>([]);
    }

    public sendMessage(message: Message): void {
        this.hub.conn$.pipe(
            tap(() => {
                this.hub.conn.invoke("SendMessage", message);
                this.messages.next([...this.messages.getValue(), message]);
            })
        ).subscribe();
    }

    public setListeningOnNewMessages(): void {
        this.hub.conn$.pipe(
            tap(() => {
                this.hub.conn.on("ReceiveMessage", (message: Message) => {
                    this.messages.next([...this.messages.getValue(), message]);
                })
            })
        ).subscribe();
    }
}