import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';
import { SigninModel } from 'src/app/entities/Security/SigninModel';

import { SecurityProvider } from 'src/app/providers/security.provider';
import { DigitExistValidator } from 'src/app/validators/digitExistValidator';
import { SpecialCharValidator } from 'src/app/validators/specialCharValidator';
import { UpperCaseCharValidator } from 'src/app/validators/uppercaseCharValidator';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../security.scss', './signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      UpperCaseCharValidator(),
      DigitExistValidator(),
      SpecialCharValidator()
    ]),
  });

  successMessage: string = "";
  errorMessage: string = "";

  blockReason: string = "";
  blockedTo: string = "";

  showSpinner: boolean = false;

  constructor(private securityProvider: SecurityProvider, private router: Router) { }

  ngOnInit(): void {
  }

  resendConfirmationEmail(): void {
    this.securityProvider.resendConfirmationEmail(this.signinForm.get('email').value);
    this.securityProvider.resultResendConfirmationEmail.pipe(
      tap((res: Result) => {
        this.successMessage = "";
        this.errorMessage = "";

        this.blockReason = "";
        this.blockedTo = "";

        switch (res.Stage) {
          case ResultStage.WAITING:
            this.showSpinner = true;
            break;

          case ResultStage.SUCCESS:
            this.successMessage = "Link potwierdzający został wysłany ponownie.";
            this.showSpinner = false;
            break;

          case ResultStage.ERROR:
            this.errorMessage = "Coś poszło nie tak :(";
            this.showSpinner = false;
            break;
        }
      })
    ).subscribe();
  }

  onSubmit() {
    this.successMessage = "";
    this.errorMessage = "";

    this.blockReason = "";
    this.blockedTo = "";

    let signinModel: SigninModel = new SigninModel(this.signinForm.get("email").value, this.signinForm.get("password").value);
    this.securityProvider.signin(signinModel);
    //TODO: pomyslec nad kodami zamiast na sztywno podawac tresc wiadomosci
    this.securityProvider.resultSignin.pipe(
      tap((res: Result) => {
        switch (res.Stage) {
          case ResultStage.WAITING:
            this.showSpinner = true;
            break;
            
          case ResultStage.SUCCESS:
            this.showSpinner = false;
            break;

          case ResultStage.ERROR:
            switch (res.Message) {
              case "Incorrect data.":
                this.errorMessage = "Podano niepoprawne dane.";
                break;
              case "Unconfirmed account.":
                this.errorMessage = "Konto nie zostało jeszcze potwierdzone.";
                break;
              case "Invalid data.":
                this.errorMessage = "Nieprawidłowy format danych.";
                break;
              default:
                if (res.Message["message"] === "Blocked account.") {
                  this.errorMessage = "Twoje konto zostało zablokowane.";
                  this.blockReason = res.Message["data"]["Reason"];
                  this.blockedTo = res.Message["data"]["BlockedTo"];
                }
                break;
            }
            this.showSpinner = false;
            break;
        }
      })
    ).subscribe();
  }

  navigateToSignUpPage() {
    this.router.navigate(['security/signup']);
  }

}
