import { Injectable, Injector } from '@angular/core';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { environment } from 'src/environments/environment.prod';
import { Hub } from './Hub';

@Injectable({
    providedIn: 'root'
})
export class InformationHub extends Hub {
    constructor(injector: Injector) {
        super(injector, new HubConnectionBuilder()
        .withUrl(`${environment.serverUrl}/informationHub`)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build());
    }
}