import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MDCRipple } from '@material/ripple';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Result } from 'src/app/entities/Result';
import { SecurityProvider } from 'src/app/providers/security.provider';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  infoMessage: string = "";
  errorMessage: string = "";
  result$: Subscription;

  email: string;
  token: string;
  params$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private securityProvider: SecurityProvider
    ) { }

  ngOnInit(): void {
    new MDCRipple(document.getElementById("send") as Element);

    this.params$ = this.route.params.pipe(
      tap((params: Params) => {
        this.email = params['email'];
        this.token = params['token'];
      })
    ).subscribe();

    console.log(this.email + " " + this.token);
  }

  confirm(): void {
    this.securityProvider.confirmEmail(this.email, this.token);
    this.result$ = this.securityProvider.result.pipe(
      tap((res: Result) => {
        if(res.Success === false) {
          this.infoMessage = "";
          switch(res.Message) {
            case "Incorrect data.":
              this.errorMessage = "Podano niepoprawne dane.";
              break;
            case "Invalid data.":
              this.errorMessage = "Nieprawidłowy format danych.";
              break;
            default:
              this.errorMessage = "Coś poszło nie tak :(";
              break;
          }
        } else if (res.Success === true) {
          this.infoMessage = "Adres email został potwierdzony";
          this.errorMessage = "";
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.params$.unsubscribe();
    this.result$.unsubscribe();
  }

}
