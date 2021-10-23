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

    constructor(
        message: string,
        nickname: string,
        roomId: number,
        sendTime: Date,
    ) {
        this.message = message;
        this.nickname = nickname;
        this.roomId = roomId;
        this.sendTime = sendTime;
    }
}