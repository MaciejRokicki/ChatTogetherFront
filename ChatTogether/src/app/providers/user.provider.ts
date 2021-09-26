import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Page } from "../entities/page";
import { BlockedUser } from "../entities/Security/blockedUser";
import { Role, User } from "../entities/user";
import { UserService } from "../services/user.service";
import { SecurityProvider } from "./security.provider";

@Injectable({
    providedIn: 'root'
})

export class UserProvider {

    user = new Subject<User>();
    users = new BehaviorSubject<Page<User>>(null);

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

    getUsers(page: number, search?: string, role?: Role): void {
        this.userService.getUsers(page, search, role).pipe(
            tap((page: Page<User>) => {
                this.users.next(page);
            })
        ).subscribe();
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
}