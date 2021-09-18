import * as signalR from '@aspnet/signalr';
import { from, Observable } from 'rxjs';

export class RoomHub {

    public conn: signalR.HubConnection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Information)
        .withUrl("https://localhost:44387/roomHub")
        .build();

    public conn$: Observable<void> = from(this.conn.start());
}