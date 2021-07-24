import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { Room } from "../entities/room";
import { Hub } from "../Hub";
import { RoomService } from "../services/room.service";

@Injectable({
    providedIn: 'root'
})

export class RoomProvider {

    room = new Subject<Room>();
    rooms = new BehaviorSubject<Room[]>([]);

    constructor(
        private roomService: RoomService,
        private hub: Hub
        ) {}

    public getRoom(id: number): void {
        this.roomService.getRoom(id).pipe(
            tap((room: Room) => {
                console.log("TEST");
                this.room.next(room);
            })
        ).subscribe();
    }

    public getRooms(): void {
        this.hub.conn$.pipe(
            tap(() => {
                this.hub.conn.on("GetRooms", (rooms: Room[]) => {
                    console.log(rooms);
                    this.rooms.next(rooms);
                })
                this.hub.conn.invoke("GetRooms");
            })
        ).subscribe();
    }

    public onRoomEnter(roomId: number): void {
        this.hub.conn$.pipe(
            tap(() => {
                this.hub.conn.invoke("EnterRoom", roomId);
                this.rooms.next([]);
            })
        ).subscribe();
    }

    public onRoomExit(roomId: number): void {
        this.hub.conn$.pipe(
            tap(() => {
                this.hub.conn.invoke("ExitRoom", roomId);
                this.hub.conn.off("ReceiveMessage");
            })
        ).subscribe();
    }
}