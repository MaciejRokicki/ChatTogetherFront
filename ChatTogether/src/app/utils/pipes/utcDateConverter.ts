import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'UTCDateConverter'})
export class UTCDateConverterPipe implements PipeTransform {
    private timezoneOffset = new Date().getTimezoneOffset();

    transform(value: string | Date): Date {
        const date: Date = typeof value === 'string' ? new Date(value) : value;

        date.setMinutes(date.getMinutes() - this.timezoneOffset);

        return date;
    }
}