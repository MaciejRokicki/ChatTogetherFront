import { formatDate } from "@angular/common";

export class Message {
    Id: number;
    Author: string;
    Time: Date;
    Text: string;

    constructor(
        id: number,
        author: string,
        time: Date,
        text: string
    ) {
        this.Id = id;
        this.Author = author;
        this.Time = time;
        this.Text = text;
    }

    public GetTimeString(): string {
        var days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

        var day = new Date(this.Time);
        day.setDate(day.getDate() + 7);

        if(day < new Date())
        {
            return formatDate(this.Time, 'dd.MM.yyyy HH:mm', 'en-US');
        } 

        return `${days[this.Time.getDay()]}, ${this.Time.getHours()}:${this.Time.getMinutes()}`
    }

}