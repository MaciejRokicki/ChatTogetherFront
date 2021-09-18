import * as signalR from '@aspnet/signalr';
import { from, Observable } from 'rxjs';

export class InformationHub {

    public conn: signalR.HubConnection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Information)
        .withUrl("https://localhost:44387/informationHub")
        .build();

    public conn$: Observable<void>;

    public StartConnection() {
        this.conn$ = from(this.conn.start());
    }
}