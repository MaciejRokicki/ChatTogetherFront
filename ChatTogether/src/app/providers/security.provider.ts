import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, concatMap, tap } from "rxjs/operators";
import { SnackbarVariant } from "../components/snackbar/snackbar.data";
import { Page } from "../entities/page";
import { Result, ResultStage } from "../entities/result";
import { BlockedUser } from "../entities/Security/blockedUser";
import { BlockUserModel } from "../entities/Security/blockUserModel";
import { ChangeRoleModel } from "../entities/Security/changeRoleModel";
import { SigninModel } from "../entities/Security/SigninModel";
import { SignupModel } from "../entities/Security/SignupModel";
import { User } from "../entities/user";
import { InformationHub } from "../Hubs/InformationHub";
import { SecurityService } from "../services/security.service";
import { SnackbarService } from "../services/snackbar.service";

@Injectable({
    providedIn: 'root'
})

export class SecurityProvider {
    public user = new BehaviorSubject<User>(null);
    public result = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));

    public blockedUsers = new BehaviorSubject<Page<BlockedUser>>(null)

    constructor(
        private securityService: SecurityService, 
        private informationHub: InformationHub, 
        private router: Router,
        private snackbarService: SnackbarService
        ) { 
            this.user.pipe(
                tap((user: User) => {
                    let hubState = this.informationHub.conn['connection']['connectionState'];

                    if (user && hubState === 2) {
                        this.informationHub.StartConnection();
                        this.listenerBlockSignout();
                    }
                })
            ).subscribe();
        }

    signup(signupModel: SignupModel): void {
        this.result.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.signup(signupModel).pipe(
            tap(() => {
                this.result.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.result.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    signin(signinModel: SigninModel): void {
        this.result.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.signin(signinModel).pipe(
            tap((user: User) => {
                this.result.next(new Result(ResultStage.SUCCESS, undefined));
                this.user.next(user);
            }),
            tap(() => {
                this.router.navigate(['/']);
            }),
            catchError(err => {
                this.result.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    signout(): void {
        this.securityService.signout().pipe(
            tap(() => {
                this.informationHub.conn.stop();
                this.user.next(null);
            }),
            tap(() => {
                this.router.navigate(['/security/signin']);
                document.body.classList.remove("dark-theme");
                document.body.classList.add("light-theme");
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
        this.result.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.changeEmail(token, newEmail).pipe(
            tap(() => {
                this.result.next(new Result(ResultStage.SUCCESS, undefined))
            }),
            catchError(err => {
                this.result.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);       
            })
        ).subscribe();
    }

    changePassword(token: string, newPassword: string): void {
        this.result.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.changePassword(token, newPassword).pipe(
            tap(() => {
                this.result.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.result.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }
    
    forgotPassword(email: string): void {
        this.result.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.forgotPassword(email).pipe(
            tap(() => {
                this.result.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.result.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();;
    }

    confirmEmail(email: string, token: string): void {
        this.result.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.confirmEmail(email, token).pipe(
            tap(() => {
                this.result.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.result.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();;
    }

    resendConfirmationEmail(email: string): void {
        this.result.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.resendConfirmationEmail(email).pipe(
            tap(() => {
                this.result.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.result.next(new Result(ResultStage.ERROR, err.error));
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

    listenerBlockSignout(): void {
        this.informationHub.conn.on("Signout", (information: string) => {
            switch (information) {
                case "ACCOUNT_BLOCKED":
                    this.snackbarService.open("Twoje konto zostało zablokowane. Aby uzyskać więcej informacji zaloguj się.", null, SnackbarVariant.ERROR);
                    break;
                
                case "ROLE_CHANGED":
                    this.snackbarService.open("Twoja rola została zmieniona, możesz się zalogować ponownie.", 10000, SnackbarVariant.INFO);
                    break;
            }
            
            this.signout();
        }); 
    }

    getBlockedUsers(page: number, search?: string): void {
        this.securityService.getBlockedUsers(page, search).pipe(
            tap((page: Page<BlockedUser>) => {
                this.blockedUsers.next(page);
            })
        ).subscribe();
    }

    blockUser(blockUserModel: BlockUserModel): void {
        this.securityService.blockUser(blockUserModel).subscribe();
    }

    unblockUser(userId: number): void {
        this.securityService.unblockUser(userId).subscribe();
    }

    changeRole(changeRoleModel: ChangeRoleModel): void {
        this.securityService.changeRole(changeRoleModel).subscribe();
    }
}