import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'MessageTimeConverter'})
export class MessageTimeConverterPipe implements PipeTransform {
    private timezoneOffset = new Date().getTimezoneOffset();

    transform(value: Date, isUTC: boolean = false): string {   
        var now = new Date();
        var dateTime = new Date(value);

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