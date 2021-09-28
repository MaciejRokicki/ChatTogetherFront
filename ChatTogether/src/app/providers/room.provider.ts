import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { CreateRoomModel } from "../entities/Room/createRoomModel";
import { Room } from "../entities/Room/room";
import { UpdateRoomModel } from "../entities/Room/updateRoomModel";
import { RoomHub } from "../Hubs/RoomHub";
import { RoomService } from "../services/room.service";

@Injectable({
    providedIn: 'root'
})
export class RoomProvider {

    room = new Subject<Room>();
    rooms = new BehaviorSubject<Room[]>([]);

    removeRoomUsersListener: Subscription;

    constructor(
        private roomService: RoomService,
        private roomHub: RoomHub,
        private router: Router
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

        this.removeRoomUsersListener = this.roomHub.conn$.pipe(
            tap(() => {
                this.roomHub.conn.on("RemoveRoomUsers", () => {
                    this.router.navigate(['']);
                })
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

        this.removeRoomUsersListener.unsubscribe();
    }

    public createRoom(room: CreateRoomModel): void {
        this.roomService.createRoom(room).subscribe();
    }

    public updateRoom(room: UpdateRoomModel): void {
        this.roomService.updateRoom(room).subscribe();
    }

    public deleteRoom(id: number): void {
        this.roomService.deleteRoom(id).subscribe();
    }
}