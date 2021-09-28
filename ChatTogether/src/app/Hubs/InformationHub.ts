import { Injectable, Injector } from '@angular/core';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Hub } from './Hub';

@Injectable({
    providedIn: 'root'
})
export class InformationHub extends Hub {
    constructor(injector: Injector) {
        super(injector, new HubConnectionBuilder()
        .withUrl("https://localhost:44387/informationHub")
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build())
    }
}