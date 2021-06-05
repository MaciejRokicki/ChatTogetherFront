import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../entities/user";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})

export class AuthProvider {
    public user = new BehaviorSubject<User>(null);
    public user$ = this.user.asObservable();

    constructor(private authService: AuthService) { }

    register(nickname: string, email: string, password: string): void {
        this.authService.register(nickname, email, password);
    }

    login(email: string, password: string): void {
        this.authService.login(email, password).pipe(
            tap((user: User) => {
                this.user.next(user);
            })
        ).subscribe();
    }

    logout(): void {
        this.user.next(null);
    }
}