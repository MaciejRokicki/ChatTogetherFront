import { BehaviorSubject } from 'rxjs';

export class TopbarTitleService {

    public title: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public title$ = this.title.asObservable();

    public setTitle(title: string) {
        this.title.next(title);
    }
}