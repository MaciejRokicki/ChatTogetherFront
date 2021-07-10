import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../entities/user";
import { UserService } from "../services/user.service";

@Injectable({
    providedIn: 'root'
})

export class UserProvider {

    user = new Subject<User>();

    constructor(
        private  userService: UserService
        ) {}

    getUser(nickname: string): void {
        this.userService.getUser(nickname).pipe(
            tap((user: User) => {
               this.user.next(user)
            })
        ).subscribe()
    }
}