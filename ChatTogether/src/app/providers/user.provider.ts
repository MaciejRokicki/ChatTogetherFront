import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Page } from "../entities/page";
import { Result, ResultStage } from "../entities/result";
import { Role, User } from "../entities/user";
import { UserService } from "../services/user.service";
import { SecurityProvider } from "./security.provider";

@Injectable({
    providedIn: 'root'
})
export class UserProvider {
    user = new Subject<User>();
    users = new BehaviorSubject<Page<User>>(null);

    public resultGetUser = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultGetUsers = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultChangeNickname = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultChangeUserData = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));

    constructor(
        private userService: UserService,
        private securityProvider: SecurityProvider
        ) {}

    getUser(nickname: string): void {
        this.resultGetUser.next(new Result(ResultStage.WAITING, undefined));

        this.userService.getUser(nickname).pipe(
            tap((user: User) => {
                if (user.birthDate) {
                    let bd = new Date(user.birthDate)
                    let timezoneOffset = bd.getTimezoneOffset();
                    bd.setMinutes(bd.getMinutes() - timezoneOffset);
                    user.birthDate = bd;
                }
               this.user.next(user);
               this.resultGetUser.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultGetUser.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe()
    }

    getUsers(page: number, search?: string, role?: Role): void {
        this.resultGetUsers.next(new Result(ResultStage.WAITING, undefined));
        
        this.userService.getUsers(page, search, role).pipe(
            tap((page: Page<User>) => {
                this.users.next(page);
                this.resultGetUsers.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultGetUsers.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    changeNickname(nickname: string): void {
        this.resultChangeNickname.next(new Result(ResultStage.WAITING, undefined));

        this.userService.changeNickname(nickname).pipe(
            tap(() => {
                this.resultChangeNickname.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultChangeNickname.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    changeUserData(user: User): void {
        this.resultChangeUserData.next(new Result(ResultStage.WAITING, undefined));
        
        this.userService.changeUserData(user).pipe(
            tap((newUser: User) => {
                this.user.next(newUser);
                this.securityProvider.user.next(newUser);
                this.resultChangeUserData.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultChangeUserData.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }
}