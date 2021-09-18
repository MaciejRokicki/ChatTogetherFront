import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { Room } from "../entities/room";
import { RoomHub } from "../Hubs/RoomHub";
import { RoomService } from "../services/room.service";

@Injectable({
    providedIn: 'root'
})

export class RoomProvider {

    room = new Subject<Room>();
    rooms = new BehaviorSubject<Room[]>([]);

    constructor(
        private roomService: RoomService,
        private roomHub: RoomHub
        ) {}

    public getRoom(id: number): void {
        this.roomService.getRoom(id).pipe(
            tap((room: Room) => {
                this.room.next(room);
            })
        ).subscribe();
    }

    public getRooms(): void {
        this.roomHub.conn$.pipe(
            tap(() => {
                this.roomHub.conn.on("GetRooms", (rooms: Room[]) => {
                    this.rooms.next(rooms);
                })
                this.roomHub.conn.invoke("GetRooms");
            })
        ).subscribe();
    }

    public onRoomEnter(roomId: number): void {
        this.roomHub.conn$.pipe(
            tap(() => {
                this.roomHub.conn.invoke("EnterRoom", roomId);
                this.rooms.next([]);
            })
        ).subscribe();
    }

    public onRoomExit(roomId: number): void {
        this.roomHub.conn$.pipe(
            tap(() => {
                this.roomHub.conn.invoke("ExitRoom", roomId);
                this.roomHub.conn.off("ReceiveMessage");
            })
        ).subscribe();
    }
}