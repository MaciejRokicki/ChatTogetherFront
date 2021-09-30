import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";

import { Message } from "../entities/message";
import { RoomHub } from "../Hubs/RoomHub";
import { MessageService } from "../services/message.service";

@Injectable({
    providedIn: 'root'
})
export class MessageProvider {
    messages = new BehaviorSubject<Message[]>([])

    constructor(
        private messageService: MessageService,
        private roomHub: RoomHub
        ) { }

    public getMessages(roomId: number, size: number = 20, lastMessageDate: Date = new Date()): void {
        this.messageService.getMessages(roomId, size, lastMessageDate).pipe(
            tap((messages: Message[]) => {
                this.messages.next([...messages, ...this.messages.getValue()]);
            })
        ).subscribe();
    }

    public clearMessages(): void {
        this.messages = new BehaviorSubject<Message[]>([]);
    }

    public sendMessage(message: Message): void {
        this.roomHub.conn$.pipe(
            tap(() => {
                this.roomHub.conn.invoke("SendMessage", message);
                this.messages.next([...this.messages.getValue(), message]);
            })
        ).subscribe();
    }

    public setListeningOnNewMessages(): void {
        this.roomHub.conn$.pipe(
            tap(() => {
                this.roomHub.conn.on("ReceiveMessage", (message: Message) => {
                    this.messages.next([...this.messages.getValue(), message]);
                })
            })
        ).subscribe();
    }
}