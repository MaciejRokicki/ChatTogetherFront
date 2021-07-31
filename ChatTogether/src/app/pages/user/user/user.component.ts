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
import { SnakcbarService } from 'src/app/services/snackbar.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private topbarTitleService: TopbarTitleService,
    private securityProvider: SecurityProvider,
    private userProvider: UserProvider,
    private dialog: MatDialog,
    private snackbarService: SnakcbarService
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

  changeNicknameOpenModal(): void {
    const editUserDialogRef = this.dialog.open(ChangeNicknameDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: this.nickname
    });

    editUserDialogRef.afterClosed().subscribe(result => {
      if(result?.showSnackbar) {
        this.snackbarService.open("Pseudonim został zmieniony.");
        this.securityProvider.signout();
        this.router.navigate(['security/signin']);
      }
    });
  }

  changeEmail(): void {
    this.securityProvider.changeEmailRequest();
    this.snackbarService.open("Prośba o zmianę adres email została wysłana na aktualny adres email.");
  }

  changePassword(): void {
    this.securityProvider.changePasswordRequest();
    this.snackbarService.open("Prośba o zmianę hasła została wysłana na adres email.");
  }

  userEditOpenModal(): void {
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

    editUserDialogRef.afterClosed().subscribe(result => {
      if(result?.showSnackbar) {
        this.snackbarService.open("Dane zostały zmienione.");
      }
    });
  }

  aboutMeEditOpenModal(): void {
    const editUserDialogRef = this.dialog.open(EditAboutMeDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: {
        user: this.user,
        aboutMe: this.user.description ? this.user.description : ""
      }
    });

    editUserDialogRef.afterClosed().subscribe(result => {
      if(result?.showSnackbar) {
        this.snackbarService.open("Opis został zmieniony.");
      }
    });
  }

  ngOnDestroy(): void {
    this.nickname$.unsubscribe();
    this.user$.unsubscribe();
    this.authUser$.unsubscribe();
  }

}
