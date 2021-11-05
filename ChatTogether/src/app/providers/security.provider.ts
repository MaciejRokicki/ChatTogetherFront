import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HubConnectionState } from "@microsoft/signalr";
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
import { RoomHub } from "../Hubs/RoomHub";
import { SecurityService } from "../services/security.service";
import { SnackbarService } from "../services/snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class SecurityProvider {
    public user = new BehaviorSubject<User>(null);
    
    public resultSignup = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultSignin = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultChangeEmail = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultChangePassword = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultForgotPassword = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultConfirmEmail = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultResendConfirmationEmail = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultChangeEmailRequest = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultChangePasswordRequest = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultGetBlockedUsers = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultBlockUser = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultUnblockUser = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));
    public resultChangeRole = new BehaviorSubject<Result>(new Result(ResultStage.INITIAL, undefined));

    public blockedUsers = new BehaviorSubject<Page<BlockedUser>>(null)

    constructor(
        private securityService: SecurityService, 
        private informationHub: InformationHub,
        private roomHub: RoomHub,
        private router: Router,
        private snackbarService: SnackbarService
        ) { 
            this.user.pipe(
                tap((user: User) => {
                    if (user) {
                        this.informationHub.startConnection();
                        this.roomHub.startConnection();

                        this.listenerBlockSignout();
                    } else {
                        this.informationHub.stopConnection();
                        this.roomHub.stopConnection();
                    }
                })
            ).subscribe();
        }

    signup(signupModel: SignupModel): void {
        this.resultSignup.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.signup(signupModel).pipe(
            tap(() => {
                this.resultSignup.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultSignup.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    signin(signinModel: SigninModel): void {
        this.resultSignin.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.signin(signinModel).pipe(
            tap((user: User) => {
                this.resultSignin.next(new Result(ResultStage.SUCCESS, undefined));
                this.user.next(user);
            }),
            tap(() => {
                this.router.navigate(['/']);
            }),
            catchError(err => {
                this.resultSignin.next(new Result(ResultStage.ERROR, err.error));
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
        this.resultChangeEmail.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.changeEmail(token, newEmail).pipe(
            tap(() => {
                this.resultChangeEmail.next(new Result(ResultStage.SUCCESS, undefined))
            }),
            catchError(err => {
                this.resultChangeEmail.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);       
            })
        ).subscribe();
    }

    changePassword(token: string, newPassword: string): void {
        this.resultChangePassword.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.changePassword(token, newPassword).pipe(
            tap(() => {
                this.resultChangePassword.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultChangePassword.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }
    
    forgotPassword(email: string): void {
        this.resultForgotPassword.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.forgotPassword(email).pipe(
            tap(() => {
                this.resultForgotPassword.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultForgotPassword.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();;
    }

    confirmEmail(email: string, token: string): void {
        this.resultConfirmEmail.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.confirmEmail(email, token).pipe(
            tap(() => {
                this.resultConfirmEmail.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultConfirmEmail.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();;
    }

    resendConfirmationEmail(email: string): void {
        this.resultResendConfirmationEmail.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.resendConfirmationEmail(email).pipe(
            tap(() => {
                this.resultResendConfirmationEmail.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultResendConfirmationEmail.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    changeEmailRequest(): void {
        this.resultChangeEmailRequest.next(new Result(ResultStage.WAITING, undefined));

        this.securityService.changeEmailRequest().subscribe({
            complete: () => {
                this.resultChangeEmailRequest.next(new Result(ResultStage.SUCCESS, undefined));
            }
        });
    }

    changePasswordRequest(): void {
        this.resultChangePasswordRequest.next(new Result(ResultStage.WAITING, undefined));
        
        this.securityService.changePasswordRequest().subscribe({
            complete: () => {
                this.resultChangePasswordRequest.next(new Result(ResultStage.SUCCESS, undefined));
            }
        });
    }

    listenerBlockSignout(): void {
        this.informationHub.conn.on("Signout", (information: string) => {
            switch (information) {
                case "ACCOUNT_BLOCKED":
                    this.snackbarService.open("Twoje konto zostało zablokowane. Aby uzyskać więcej informacji zaloguj się.", null, SnackbarVariant.ERROR);
                    break;
                
                case "ROLE_CHANGED":
                    this.snackbarService.open("Twoja rola została zmieniona, możesz zalogować się ponownie.", 10000, SnackbarVariant.INFO);
                    break;
            }
            
            this.signout();
        }); 
    }

    getBlockedUsers(page: number, search?: string): void {
        this.resultGetBlockedUsers.next(new Result(ResultStage.WAITING, undefined));

        this.securityService.getBlockedUsers(page, search).pipe(
            tap((page: Page<BlockedUser>) => {
                this.blockedUsers.next(page);
                this.resultGetBlockedUsers.next(new Result(ResultStage.SUCCESS, undefined));
            }),
            catchError(err => {
                this.resultGetBlockedUsers.next(new Result(ResultStage.ERROR, err.error));
                return throwError(err);
            })
        ).subscribe();
    }

    blockUser(blockUserModel: BlockUserModel): void {
        this.resultBlockUser.next(new Result(ResultStage.WAITING, undefined));

        this.securityService.blockUser(blockUserModel).subscribe({
            complete: () => {
                this.resultBlockUser.next(new Result(ResultStage.SUCCESS, undefined));
            }
        });
    }

    unblockUser(userId: number): void {
        this.resultUnblockUser.next(new Result(ResultStage.WAITING, undefined));

        this.securityService.unblockUser(userId).subscribe({
            complete: () => {
                this.resultUnblockUser.next(new Result(ResultStage.SUCCESS, undefined));
            }
        });
    }

    changeRole(changeRoleModel: ChangeRoleModel): void {
        this.resultChangeRole.next(new Result(ResultStage.WAITING, undefined));

        this.securityService.changeRole(changeRoleModel).subscribe({
            complete: () => {
                this.resultChangeRole.next(new Result(ResultStage.SUCCESS, undefined));
            }
        });
    }
}