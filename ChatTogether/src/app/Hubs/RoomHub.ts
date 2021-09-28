import { Injectable, Injector } from '@angular/core';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Hub } from './Hub';

@Injectable({
    providedIn: 'root'
})
export class RoomHub extends Hub {
    constructor(injector: Injector) {
        super(injector, new HubConnectionBuilder()
        .withUrl("https://localhost:44387/roomHub")
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build())
    }
}