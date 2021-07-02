import { formatDate } from "@angular/common";
import { Guid } from "guid-typescript";

export class Message {
    id: Guid;
    message: string;
    nickname: string;
    roomId: number;
    sendTime: Date;
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

    public GetTimeString(): string {
        var days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

        var day = new Date(this.sendTime);
        day.setDate(day.getDate() + 7);

        if(day < new Date())
        {
            return formatDate(this.sendTime, 'dd.MM.yyyy HH:mm', 'en-US');
        } 

        return `${days[this.sendTime.getDay()]}, ${this.sendTime.getHours()}:${this.sendTime.getMinutes()}`
    }
}