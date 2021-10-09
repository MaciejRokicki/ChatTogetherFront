import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { from, Observable } from "rxjs";
import { BlockedBackgroundService } from '../services/blockedBackgroundService';

export abstract class Hub {
    private router: Router;
    private blockedBackgroundService: BlockedBackgroundService;

    public conn: HubConnection;
    public conn$: Observable<void>;

    private tryingToReconnect: boolean = false;

    constructor(protected injector: Injector, _conn: HubConnection) {
        this.router = this.injector.get(Router);
        this.blockedBackgroundService = this.injector.get(BlockedBackgroundService);

        this.conn = _conn;

        this.conn.onreconnecting(() => {
            if (!this.tryingToReconnect) {
                this.blockedBackgroundService.show("Utracono połączenie z serwerem. Trwa próba nawiązania ponownego połączenia.");
            }

            this.tryingToReconnect = true;
        })

        this.conn.onreconnected(() => {
            this.tryingToReconnect = false;
            this.blockedBackgroundService.hide();
            this.router.navigate(['']);
        })

        this.conn.onclose(() => {
            if(this.tryingToReconnect) {
                this.blockedBackgroundService.show("Nie można nawiązać połączenia z serwerem. Spróbuj ponownie później.");
            }
        })
    }

    public startConnection(): void {
        let state: HubConnectionState = this.conn.state;

        if (state === HubConnectionState.Disconnected) {
            this.conn$ = from(this.conn.start());
        }
    }

    public stopConnection(): void {
        let state: HubConnectionState = this.conn.state;

        if (state === HubConnectionState.Connected) {
            this.conn$ = from(this.conn.stop());
        }
    }
}