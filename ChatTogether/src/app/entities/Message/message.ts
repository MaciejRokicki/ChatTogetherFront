import { Guid } from "guid-typescript";
import { MessageFile } from "./messageFile";

export class Message {
    id: Guid;
    message: string;
    nickname: string;
    roomId: number;
    sendTime: Date;
    receivedTime: Date;
    files: MessageFile[];
    isDeleted: boolean = false;

    constructor(
        message: string,
        nickname: string,
        roomId: number,
        sendTime: Date,
    ) {
        this.id = Guid.create()['value'];
        this.message = message;
        this.nickname = nickname;
        this.roomId = roomId;
        this.sendTime = sendTime;
    }
}