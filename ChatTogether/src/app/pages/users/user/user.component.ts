import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { User } from 'src/app/entities/user';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserProvider } from 'src/app/providers/user.provider';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { EditAboutMeDialogComponent } from '../edit-about-me-dialog/edit-about-me-dialog.component';
import { ChangeNicknameDialogComponent } from '../change-nickname-dialog/change-nickname-dialog.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarVariant } from 'src/app/components/snackbar/snackbar.data';
import { ChangeRoleDialogComponent } from '../change-role-dialog/change-role-dialog.component';
import { BlockUserDialogComponent } from '../block-user-dialog/block-user-dialog.component';
import { UnblockConfirmationDialogComponent } from 'src/app/components/unblock-confirmation-dialog/unblock-confirmation-dialog.component';
import { Result, ResultStage } from 'src/app/entities/result';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  nickname: string;
  nickname$: Subscription;

  authUser: User;
  authUser$: Subscription;

  user: User;
  user$: Subscription;

  disabledChangeUserDataButton: boolean = false;
  disabledChangeAboutMeButton: boolean = false;
  
  disabledChangeNicknameButton: boolean = false;
  disabledChangeEmailButton: boolean = false;
  disabledChangePasswordButton: boolean = false;

  disabledBlockButton: boolean = false;
  disabledUnblockButton: boolean = false;
  disabledChangeRoleButton: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private topbarTitleService: TopbarTitleService,
    private securityProvider: SecurityProvider,
    private userProvider: UserProvider,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
    ) {
      this.nickname$ = this.route.params.pipe(
        tap((params: Params) => {
          this.nickname = params['nickname'];
        }),
        tap(() => {
          this.userProvider.getUser(this.nickname);
          this.user$ = this.userProvider.user.pipe(
            tap((user: User) => {
              this.user = user;
            })
          ).subscribe();
        }),
        tap(() => {
          this.authUser$ = this.securityProvider.user.pipe(
            tap((user: User) => {
              this.authUser = user;
              
              if(this.nickname === this.authUser?.nickname) {
                this.topbarTitleService.setTitle("Mój profil");
              } else {
                this.topbarTitleService.setTitle(this.nickname);
              }
            })
          ).subscribe()
        })
      ).subscribe()
    }

  ngOnInit(): void {

  }

  changeNicknameOpenDialog(): void {
    this.disabledChangeNicknameButton = true;

    const editUserDialogRef = this.dialog.open(ChangeNicknameDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: this.nickname
    });

    editUserDialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || result?.success === false) {
          this.disabledChangeNicknameButton = false;
        }

        if(result?.showSnackbar) {
          this.snackbarService.open("Pseudonim został zmieniony.", 10000, SnackbarVariant.SUCCESS);
          this.securityProvider.signout();
          this.router.navigate(['security/signin']);
        }
      })
    ).subscribe();
  }

  changeEmail(): void {
    this.disabledChangeEmailButton = true;

    this.securityProvider.changeEmailRequest();

    this.securityProvider.resultChangeEmailRequest.pipe(
      tap((result: Result) => {
        switch (result.Stage) {
          case ResultStage.WAITING:
            break;

          case ResultStage.SUCCESS:
            this.snackbarService.open("Prośba o zmianę adres email została wysłana na aktualny adres email.");
            this.disabledChangeEmailButton = false;
            break;

          case ResultStage.ERROR:
            this.disabledChangeEmailButton = false;
            break;
        }
      })
    ).subscribe();
  }

  changePassword(): void {
    this.disabledChangePasswordButton = true;

    this.securityProvider.changePasswordRequest();

    this.securityProvider.resultChangePasswordRequest.pipe(
      tap((result: Result) => {
        switch (result.Stage) {
          case ResultStage.WAITING:
            break;

          case ResultStage.SUCCESS:
            this.snackbarService.open("Prośba o zmianę hasła została wysłana na adres email.");
            this.disabledChangePasswordButton = false;
            break;

          case ResultStage.ERROR:
            this.disabledChangePasswordButton = false;
            break;
        }
      })
    ).subscribe();
  }

  userEditOpenDialog(): void {
    this.disabledChangeUserDataButton = true;

    const editUserDialogRef = this.dialog.open(EditUserDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: {
        firstName: this.user.firstName ? this.user.firstName : "",
        lastName: this.user.lastName ? this.user.lastName : "",
        birthDate: this.user.birthDate ? this.user.birthDate : null,
        city: this.user.city ? this.user.city : ""
      }
    });

    editUserDialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || result?.success === false) {
          this.disabledChangeUserDataButton = false;
        }

        if(result?.showSnackbar) {
          this.snackbarService.open("Dane zostały zmienione.", 10000, SnackbarVariant.SUCCESS);
          this.disabledChangeUserDataButton = false;
        }
      })
    ).subscribe();
  }

  aboutMeEditOpenDialog(): void {
    this.disabledChangeAboutMeButton = true;

    const editUserDialogRef = this.dialog.open(EditAboutMeDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: {
        user: this.user,
        aboutMe: this.user.description ? this.user.description : ""
      }
    });

    editUserDialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || result?.success === false) {
          this.disabledChangeAboutMeButton = false;
        }

        if(result?.showSnackbar) {
          this.snackbarService.open("Opis został zmieniony.", 10000, SnackbarVariant.SUCCESS);
          this.disabledChangeAboutMeButton = false;
        }        
      })
    ).subscribe();
  }

  changeRoleOpenDialog(): void {
    this.disabledChangeRoleButton = true;

    const changeRoleDialogRef = this.dialog.open(ChangeRoleDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: this.user
    });

    changeRoleDialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || result?.success === false) {
          this.disabledChangeRoleButton = false;
        }

        if(result?.showSnackbar) {
          this.snackbarService.open(`Rola użytkownika: ${this.user.nickname} została zmieniona.`, 10000, SnackbarVariant.SUCCESS);
          this.disabledChangeRoleButton = false;

          this.user.role = result.role;
          this.userProvider.user.next(this.user);
        }
      })
    ).subscribe();
  }

  blockUserOpenDialog(): void {
    this.disabledBlockButton = true;

    const blockUserDialogRef = this.dialog.open(BlockUserDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: this.user
    });

    blockUserDialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || result?.success === false) {
          this.disabledBlockButton = false;
        }

        if(result?.showSnackbar) {
          this.snackbarService.open(`Konto użytkownika: ${this.user.nickname} zostało zablokowane.`, 10000, SnackbarVariant.SUCCESS); 
          this.disabledBlockButton = false;

          this.user.isBlocked = true;
          this.userProvider.user.next(this.user);
        }
      })
    ).subscribe();
  }

  unblockUserOpenDialog(): void {
    this.disabledUnblockButton = true;

    const unblockConfirmationDialogRef = this.dialog.open(UnblockConfirmationDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: this.user
    });

    unblockConfirmationDialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || result?.success === false) {
          this.disabledUnblockButton = false;
        }

        if(result?.showSnackbar) {
          this.snackbarService.open(`Konto użytkownika: ${this.user.nickname} zostało zablokowane.`, 10000, SnackbarVariant.SUCCESS); 
          this.disabledUnblockButton = false;

          this.user.isBlocked = false;
          this.userProvider.user.next(this.user);
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.nickname$.unsubscribe();
    this.user$.unsubscribe();
    this.authUser$.unsubscribe();
  }

}
