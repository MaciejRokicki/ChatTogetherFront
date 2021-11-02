import { Message } from "../entities/Message/message";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageFile } from "../entities/Message/messageFile";

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    readonly url = `${environment.apiUrl}/Message`;
    readonly staticUrl = environment.staticUrl;

    constructor(private http: HttpClient) { }

    getMessages(roomId: number, size: number, lastMessageDate: Date): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.url}/GetMessages?roomId=${roomId}&size=${size}&lastMessageDate=${lastMessageDate.toISOString()}`);
    }

    uploadMessageFiles(formData: FormData): Observable<MessageFile[]> {
        return this.http.post<MessageFile[]>(`${this.url}/UploadMessageFiles`, formData);
    }

    downloadFile(sourceUrl: string): Observable<any> {
        return this.http.get(`${this.staticUrl}/${sourceUrl}`, { responseType: 'blob' });
    }
}