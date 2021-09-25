import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarVariant } from 'src/app/components/snackbar/snackbar.data';
import { Result, ResultStage } from 'src/app/entities/result';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DigitExistValidator } from 'src/app/validators/digitExistValidator';
import { SpecialCharValidator } from 'src/app/validators/specialCharValidator';
import { UpperCaseCharValidator } from 'src/app/validators/uppercaseCharValidator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['../../security.scss', './change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(6), 
      UpperCaseCharValidator(), 
      DigitExistValidator(),
      SpecialCharValidator()
    ])
  });

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

  onSubmit() {
    let newPassword = this.changePasswordForm.get("password").value;
    this.securityProvider.changePassword(this.token, newPassword);
    this.result$ = this.securityProvider.result.pipe(
      tap((res: Result) => {
        this.infoMessage = "";
        this.errorMessage = "";

        switch (res.Stage) {
          case ResultStage.SUCCESS:
            this.snackbarService.open("Hasło zostało zmienione.", 30000, SnackbarVariant.SUCCESS);
            this.router.navigate(['security/signin']);
            break;

          case ResultStage.ERROR:
            switch(res.Message) {
              case "Incorrect data.":
                this.errorMessage = "Podano niepoprawne dane.";
                break;
              case "Invalid data.":
                this.errorMessage = "Nieprawidłowy format danych.";
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
