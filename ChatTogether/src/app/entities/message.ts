import { Guid } from "guid-typescript";

export class Message {
    id: Guid;
    message: string;
    nickname: string;
    roomId: number;
    sendTime: Date;
    sendTimeStr: string;
    receivedTime: Date;

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