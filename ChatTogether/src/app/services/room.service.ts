import { Room } from "../entities/room";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    readonly url = `${environment.apiUrl}/Room`;

    constructor(private http: HttpClient) { }

    getRoom(id: number): Observable<Room> {
        return this.http.get<Room>(`${this.url}/GetRoom?id=${id}`);
    }
}