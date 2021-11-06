import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, Subscription, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Result, ResultStage } from "../entities/result";
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

    public resultCreateRoom = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultUpdateRoom = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultDeleteRoom = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));

    constructor(
        private roomService: RoomService,
        private roomHub: RoomHub,
        private router: Router
        ) { }

    public getRoom(id: number): void {
        this.roomService.getRoom(id).pipe(
            tap((room: Room) => {
                this.room.next(room);
            })
        ).subscribe();
    }

    public getRoomsListener(): void {
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
        this.resultCreateRoom.next(new Result(ResultStage.WAITING, undefined));

        this.roomService.createRoom(room).pipe(
            tap(() => {
                this.resultCreateRoom.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultCreateRoom.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    public updateRoom(room: UpdateRoomModel): void {
        this.resultUpdateRoom.next(new Result(ResultStage.WAITING, undefined));

        this.roomService.updateRoom(room).pipe(
            tap(() => {
                this.resultUpdateRoom.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultUpdateRoom.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    public deleteRoom(id: number): void {
        this.resultDeleteRoom.next(new Result(ResultStage.WAITING, undefined));

        this.roomService.deleteRoom(id).pipe(
            tap(() => {
                this.resultDeleteRoom.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultDeleteRoom.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }
}