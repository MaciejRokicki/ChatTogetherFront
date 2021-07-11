import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Result } from "../entities/Result";
import { SigninModel } from "../entities/Security/SigninModel";
import { SignupModel } from "../entities/Security/SignupModel";
import { User } from "../entities/user";
import { SecurityService } from "../services/security.service";

@Injectable({
    providedIn: 'root'
})

export class SecurityProvider {
    public user = new BehaviorSubject<User>(null);
    public result = new BehaviorSubject<Result>(new Result(null, undefined));

    constructor(private securityService: SecurityService, private router: Router) { }

    signup(signupModel: SignupModel): void {
        this.securityService.signup(signupModel).pipe(
            tap(() => {
                this.result.next(new Result(true, undefined));
            }),
            catchError(err => {
                this.result.next(new Result(false, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    signin(signinModel: SigninModel): void {
        this.securityService.signin(signinModel).pipe(
            tap((user: User) => {
                this.result.next(new Result(true, undefined));
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

    signout(): void {
        this.securityService.signout().pipe(
            tap(() => {
                this.user.next(null);
            })
        ).subscribe();
    }

    validate(): void {
        this.securityService.validate().pipe(
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

    changeEmail(token: string, newEmail: string): void {
        this.securityService.changeEmail(token, newEmail).pipe(
            tap(() => {
                this.result.next(new Result(true, undefined))
            }),
            catchError(err => {
                this.result.next(new Result(false, err.error));
                return throwError(err);       
            })
        ).subscribe();
        //TODO: podmienic email w user
    }

    changePassword(token: string, newPassword: string): void {
        this.securityService.changePassword(token, newPassword).pipe(
            tap(() => {
                this.result.next(new Result(true, undefined));
            }),
            catchError(err => {
                this.result.next(new Result(false, err.error));
                return throwError(err);
            })
        ).subscribe();
    }
    
    forgotPassword(email: string): void {
        this.securityService.forgotPassword(email).pipe(
            tap(() => {
                this.result.next(new Result(true, undefined));
            }),
            catchError(err => {
                this.result.next(new Result(false, err.error));
                return throwError(err);
            })
        ).subscribe();;
    }

    confirmEmail(email: string, token: string): void {
        this.securityService.confirmEmail(email, token).pipe(
            tap(() => {
                this.result.next(new Result(true, undefined));
            }),
            catchError(err => {
                this.result.next(new Result(false, err.error));
                return throwError(err);
            })
        ).subscribe();;
    }

    resendConfirmationEmail(email: string): void {
        this.securityService.resendConfirmationEmail(email).pipe(
            tap(() => {
                this.result.next(new Result(true, undefined));
            }),
            catchError(err => {
                this.result.next(new Result(false, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    changeEmailRequest(): void {
        this.securityService.changeEmailRequest().subscribe();
    }

    changePasswordRequest(): void {
        this.securityService.changePasswordRequest().subscribe();
    }
}