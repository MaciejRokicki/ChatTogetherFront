import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Room } from "../entities/room";
import { RoomService } from "../services/room.service";

@Injectable({
    providedIn: 'root'
})

export class RoomProvider {

    allRooms = new BehaviorSubject<Room[]>([]);

    constructor(private roomService: RoomService) {

    }

    public getRooms() : void {
        this.roomService.getRooms().subscribe((rooms : Room[]) => {
            this.allRooms.next(rooms);
        })
    }
}