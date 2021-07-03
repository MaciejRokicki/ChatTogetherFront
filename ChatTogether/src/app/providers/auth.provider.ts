import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Result } from "../entities/Result";
import { SigninModel } from "../entities/Security/SigninModel";
import { SignupModel } from "../entities/Security/SignupModel";
import { User } from "../entities/user";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})

export class AuthProvider {
    public user = new BehaviorSubject<User>(null);
    public result = new BehaviorSubject<Result>(new Result(true, undefined));

    constructor(private authService: AuthService, private router: Router) { }

    register(signupModel: SignupModel): void {
        this.authService.register(signupModel);
    }

    login(signinModel: SigninModel): void {
        this.authService.login(signinModel).pipe(
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
                    this.router.navigate(['/security/signin']);
                    this.user.next(null);
                }
                
                return throwError(err);
            })
        ).subscribe({
            error(err) { }
        });     
    }
}