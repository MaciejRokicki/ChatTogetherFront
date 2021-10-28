import { Injectable } from "@angular/core";

import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { Message } from "../entities/Message/message";
import { MessageFile } from "../entities/Message/messageFile";
import { Result, ResultStage } from "../entities/result";
import { RoomHub } from "../Hubs/RoomHub";
import { MessageService } from "../services/message.service";

@Injectable({
    providedIn: 'root'
})
export class MessageProvider {
    public messageFiles = new BehaviorSubject<MessageFile[]>([]);
    public resultMessageFiles = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));

    public messages = new BehaviorSubject<Message[]>([]);

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

    public uploadMessageFiles(formData: FormData): void {
        this.resultMessageFiles.next(new Result(ResultStage.WAITING, undefined));
        this.messageFiles.next([]);

        this.messageService.uploadMessageFiles(formData).pipe(
            tap((messageFiles: MessageFile[]) => {
                this.messageFiles.next(messageFiles);
                this.resultMessageFiles.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultMessageFiles.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    public downloadFile(messageFile: MessageFile) {
        this.messageService.downloadFile(messageFile.sourceName).pipe(
            tap((data) => {
                let link = document.createElement("a");
                let blob = new Blob([data], { type: messageFile.type });

                link.href = window.URL.createObjectURL(blob);
                link.download = messageFile.fileName;
                link.click();
                link.remove();      
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