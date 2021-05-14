import { Message } from "../entities/message";
import { Observable } from 'rxjs';

export class MessageService {

    private allMessages: Observable<Message[]> = new Observable(sub => {
        let messages: Message[] = [
            new Message(1, 'Ja', new Date(2021, 4, 11, 10, 19, 10), 'test0 ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss'),
            new Message(2, 'User1', new Date(2021, 4, 11, 10, 19, 14), 'test1 ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss'),
            new Message(3, 'User2', new Date(2021, 4, 11, 10, 19, 20), 'test2'),
            new Message(4, 'Ja', new Date(2021, 4, 11, 10, 19, 32), 'test3'),
            new Message(5, 'User2', new Date(2021, 4, 11, 10, 19, 36), 'test4'),
            new Message(6, 'User3', new Date(2021, 4, 11, 10, 19, 40), 'test5'),
            new Message(7, 'User1', new Date(2021, 4, 11, 10, 19, 44), 'test6'),
            new Message(8, 'Ja', new Date(2021, 4, 11, 10, 20, 6), 'test7'),
            new Message(9, 'User2', new Date(2021, 4, 11, 10, 20, 15), 'test8'),
            new Message(10, 'User1', new Date(2021, 4, 11, 10, 20, 20), 'test9'),
            new Message(11, 'User1', new Date(2021, 4, 11, 10, 20, 23), 'test10'),
            new Message(12, 'Ja', new Date(2021, 4, 11, 10, 20, 25), 'test11'),
            new Message(13, 'User2', new Date(2021, 4, 11, 10, 20, 33), 'test12'),
            new Message(14, 'User1', new Date(2021, 4, 11, 10, 20, 40), 'test13')
        ]

        sub.next(messages);
    });

    public getMessages(): Observable<Message[]> {
        return this.allMessages;
    }

    public sendMessage(message: Message): Observable<Message> {
        this.allMessages.subscribe(sub => {
            sub.push(message);
        });

        return new Observable<Message>();
    }
}