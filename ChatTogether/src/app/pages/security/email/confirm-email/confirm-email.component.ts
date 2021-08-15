import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarVariant } from 'src/app/components/snackbar/snackbar.data';
import { Result, ResultStage } from 'src/app/entities/Result';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['../../security.scss', './confirm-email.component.scss']
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
    private securityProvider: SecurityProvider,
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
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
        this.infoMessage = "";
        this.errorMessage = "";

        switch (res.Stage) {
          case ResultStage.SUCCESS:
            this.snackbarService.open("Adres email został potwierdzony, możesz się teraz zalogować.", 30000, SnackbarVariant.SUCCESS);
            this.router.navigate(['security/signin']);
            break;

          case ResultStage.ERROR:
            switch (res.Message) {
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
            break;

          case ResultStage.WAITING:
            this.infoMessage = "Daj nam chwilę, pracujemy nad tym...";
            break;
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.params$.unsubscribe();
    this.result$.unsubscribe();
  }

}
