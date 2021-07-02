import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Result } from "../entities/Result";
import { LoginModel } from "../entities/Security/LoginModel";
import { RegistrationModel } from "../entities/Security/RegistrationModel";
import { User } from "../entities/user";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})

export class AuthProvider {
    public user = new BehaviorSubject<User>(null);
    public result = new BehaviorSubject<Result>(new Result(true, undefined));

    constructor(private authService: AuthService, private router: Router) { }

    register(registrationModel: RegistrationModel): void {
        this.authService.register(registrationModel);
    }

    login(loginModel: LoginModel): void {
        this.authService.login(loginModel).pipe(
            tap((user: User) => {
                this.user.next(user);
            }),
            tap(() => {
                this.router.navigate(['/']);
            }),
            catchError(err => {
                this.result.next(new Result(false, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    logout(): void {
        this.authService.logout();
        this.user.next(null);
    }

    validate(): void {
        this.authService.validate().pipe(
            tap((user: User) => {
                this.user.next(user);
            }),
            tap(() => {
                this.router.navigate([this.router.url]);
            }),
            catchError(err => {
                if(err.status === 401)
                {
                    this.router.navigate(['/login']);
                    this.user.next(null);
                }
                
                return throwError(err);
            })
        ).subscribe({
            error(err) { }
        });     
    }
}