import { Room } from "../entities/Room/room";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateRoomModel } from "../entities/Room/createRoomModel";
import { UpdateRoomModel } from "../entities/Room/updateRoomModel";

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    readonly url = `${environment.apiUrl}/Room`;

    constructor(private http: HttpClient) { }

    getRoom(id: number): Observable<Room> {
        return this.http.get<Room>(`${this.url}/GetRoom?id=${id}`);
    }

    createRoom(room: CreateRoomModel) {
        return this.http.post<Room>(`${this.url}/CreateRoom`, room)
    }

    updateRoom(room: UpdateRoomModel) {
        return this.http.put<Room>(`${this.url}/UpdateRoom`, room)
    }

    deleteRoom(id: number) {
        return this.http.delete(`${this.url}/DeleteRoom?id=${id}`)
    }
}