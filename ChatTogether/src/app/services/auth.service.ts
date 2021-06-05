import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { User } from "../entities/user";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    constructor() {}

    register(nickname: string, email: string, password: string): void {
        console.log("register");
    }

    login(email: string, password: string): Observable<User> {
        return of(new User(1, "Nickname", email));
    }

    logout(): boolean {
        return false;
    }
}