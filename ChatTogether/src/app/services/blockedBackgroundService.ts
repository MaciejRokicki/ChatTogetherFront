import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BlockedBackgroundModel {
    show: boolean,
    message: string
}

@Injectable({
    providedIn: 'root'
})
export class BlockedBackgroundService {
    public blockedBackgroundModel: BehaviorSubject<BlockedBackgroundModel> = new BehaviorSubject<BlockedBackgroundModel>(null);

    public show(message: string): void {
        this.blockedBackgroundModel.next(<BlockedBackgroundModel>{
            show: true, 
            message: message
        });
    }

    public hide(): void {
        this.blockedBackgroundModel.next(null);
    }
}