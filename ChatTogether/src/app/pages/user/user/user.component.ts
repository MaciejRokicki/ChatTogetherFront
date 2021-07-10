import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';
import { MDCRipple } from '@material/ripple';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { User } from 'src/app/entities/user';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserProvider } from 'src/app/providers/user.provider';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy, AfterViewInit {

  nickname: string;
  nickname$: Subscription;

  authUser: User;
  authUser$: Subscription;

  user: User;
  user$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private topbarTitleService: TopbarTitleService,
    private securityProvider: SecurityProvider,
    private userProvider: UserProvider
    ) { }

  ngOnInit(): void {
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
            this.authUser = user
    
            if(this.nickname === this.authUser.nickname) {
              this.topbarTitleService.setTitle("Mój profil");
            } else {
              this.topbarTitleService.setTitle(this.nickname);
            }
          })
        ).subscribe()
      })
    ).subscribe()
  }

  ngAfterViewInit(): void {
    const userEdit = new MDCRipple(document.getElementById('userEdit') as Element);
    userEdit.unbounded = true;
    const aboutMeEdit = new MDCRipple(document.getElementById("aboutMeEdit") as Element);
    aboutMeEdit.unbounded = true;
    new MDCRipple(document.getElementById("changeNickname") as Element);
    new MDCRipple(document.getElementById("changeEmail") as Element);
    new MDCRipple(document.getElementById("changePassword") as Element);
  }

  changeNickname(): void {
    console.log("changeNickname");
  }

  changeEmail(): void {
    console.log("changeEmail");
  }

  changePassword(): void {
    console.log("changePassword");
  }

  userEdit(): void {
    console.log("userEdit");
  }

  aboutMeEdit(): void {
    console.log("aboutMeEdit");
  }

  ngOnDestroy(): void {
    this.nickname$.unsubscribe();
    this.user$.unsubscribe();
    this.authUser$.unsubscribe();
  }

}
