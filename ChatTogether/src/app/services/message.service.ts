import { Message } from "../entities/message";
import { Observable } from 'rxjs';

export class MessageService {

    private allMessages: Observable<Message[]> = new Observable(sub => {
        let messages: Message[] = []

        for(let i = 100; i >= 0; i--) {
            let user = Math.floor(Math.random() * (10 - 0 + 1) + 0);
            let userStr = 'Ja';

            if(user != 0) {
                userStr = `User${user}`;
            }
            
            let date = new Date();
            date.setMinutes(date.getMinutes() - i);

            messages.push(new Message(i, userStr, date, `test${i}`));
        }

        sub.next(messages);
    });

    public getMessages(lastMessageDate: Date): Observable<Message[]> {
        return this.allMessages;
    }

    public sendMessage(message: Message): Observable<Message> {
        this.allMessages.subscribe(sub => {
            sub.push(message);
        });

        return new Observable<Message>();
    }
}