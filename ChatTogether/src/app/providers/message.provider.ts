import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";

import { Message } from "../entities/message";
import { Hub } from "../Hub";
import { MessageService } from "../services/message.service";
import { DateConverter } from "../utils/DateConverter";

@Injectable({
    providedIn: 'root'
})
export class MessageProvider {
    messages = new BehaviorSubject<Message[]>([])
    private timezoneOffset = new Date().getTimezoneOffset();

    constructor(
        private messageService: MessageService,
        private hub: Hub
        ) { }

    public getMessages(roomId: number, size: number = 20, lastMessageDate: Date = new Date()): void {
        this.messageService.getMessages(roomId, size, DateConverter.DateToUTC(lastMessageDate)).pipe(
            map((messages: Message[]) => {
                return messages.map((message: Message) => {
                    message.sendTimeStr = this.GetTimeString(message, true);
                    return message;
                })
            }),
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
                message.sendTimeStr = this.GetTimeString(message);
                this.messages.next([...this.messages.getValue(), message]);
            })
        ).subscribe();
    }

    public setListeningOnNewMessages(): void {
        this.hub.conn$.pipe(
            tap(() => {
                this.hub.conn.on("ReceiveMessage", (message: Message) => {
                    message.sendTimeStr = this.GetTimeString(message);
                    this.messages.next([...this.messages.getValue(), message]);
                })
            })
        ).subscribe();
    }

    private GetTimeString(message: Message, isUTC: boolean = false): string {
        var now = new Date();
        var dateTime = new Date(message.sendTime);

        if (isUTC) 
            dateTime.setMinutes(dateTime.getMinutes() - this.timezoneOffset);

        var days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

        if(Math.abs(dateTime.getDate() - now.getDate()) > 7)
            return formatDate(dateTime, 'dd.MM.yyyy HH:mm', 'en-us');
        else if (dateTime.getFullYear() == now.getFullYear() && dateTime.getMonth() == now.getMonth() && dateTime.getDate() == now.getDate())
            return 'Dziś, ' + formatDate(dateTime, 'HH:mm', 'en-us');
        else
            return `${days[dateTime.getDay()]}, ${formatDate(dateTime, 'HH:mm', 'en-us')}`;
    }
}