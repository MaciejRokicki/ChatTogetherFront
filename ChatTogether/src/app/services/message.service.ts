import { Message } from "../entities/message";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    readonly url = `${environment.apiUrl}/Message`;

    constructor(private http: HttpClient) { }

    getMessages(roomId: number, size: number, lastMessageDate: Date): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.url}/GetMessages?roomId=${roomId}&size=${size}&lastMessageDate=${lastMessageDate.toISOString()}`);
    }
}