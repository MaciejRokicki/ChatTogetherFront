import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../entities/user";
import { UserService } from "../services/user.service";
import { SecurityProvider } from "./security.provider";

@Injectable({
    providedIn: 'root'
})

export class UserProvider {

    user = new Subject<User>();

    constructor(
        private userService: UserService,
        private securityProvider: SecurityProvider
        ) {}

    getUser(nickname: string): void {
        this.userService.getUser(nickname).pipe(
            tap((user: User) => {
                if (user.birthDate) {
                    let bd = new Date(user.birthDate)
                    let timezoneOffset = bd.getTimezoneOffset();
                    bd.setMinutes(bd.getMinutes() - timezoneOffset);
                    user.birthDate = bd;
                }
               this.user.next(user);
            })
        ).subscribe()
    }

    changeNickname(nickname: string): void {
        this.userService.changeNickname(nickname).subscribe();
    }

    changeUserData(user: User): void {
        this.userService.changeUserData(user).pipe(
            tap((newUser: User) => {
                this.user.next(newUser);
                this.securityProvider.user.next(newUser);
            })
        ).subscribe();
    }

    changeUserDescription(desc: string): void {
        this.userService.changeUserData(new User(null, null, null, null, null, desc)).pipe(
            tap((newUser: User) => {
                this.user.next(newUser);
                this.securityProvider.user.next(newUser);
            })
        ).subscribe();
    }
}