import { BehaviorSubject } from 'rxjs';

export class TopbarTitleService {
    public title: BehaviorSubject<string> = new BehaviorSubject<string>("");

    public setTitle(title: string) {
        this.title.next(title);
    }
}