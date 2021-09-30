import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarVariant } from 'src/app/components/snackbar/snackbar.data';
import { Result, ResultStage } from 'src/app/entities/result';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['../../security.scss', './confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  errorMessage: string = "";

  showSpinner: boolean = false;

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
    this.result$ = this.securityProvider.resultConfirmEmail.pipe(
      tap((res: Result) => {
        this.errorMessage = "";

        switch (res.Stage) {
          case ResultStage.WAITING:
            this.showSpinner = true;
            break;
            
          case ResultStage.SUCCESS:
            this.showSpinner = false;
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
            this.showSpinner = false;
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
