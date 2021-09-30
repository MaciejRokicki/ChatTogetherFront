import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';
import { SnackbarVariant } from 'src/app/components/snackbar/snackbar.data';
import { Result, ResultStage } from 'src/app/entities/result';
import { SignupModel } from 'src/app/entities/Security/SignupModel';

import { SecurityProvider } from 'src/app/providers/security.provider';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { FormControlStateMatcher } from 'src/app/utils/formControlStateMatcher';
import { DigitExistValidator } from 'src/app/validators/digitExistValidator';
import { SpecialCharValidator } from 'src/app/validators/specialCharValidator';
import { UpperCaseCharValidator } from 'src/app/validators/uppercaseCharValidator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../security.scss', './signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    nickname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(6), 
      UpperCaseCharValidator(), 
      DigitExistValidator(), 
      SpecialCharValidator()
    ]),
    confirmPassword: new FormControl('', [
      Validators.required, 
      Validators.minLength(6), 
      UpperCaseCharValidator(), 
      DigitExistValidator(),
      SpecialCharValidator()
    ]),
  });

  invalidFormMatcher = new FormControlStateMatcher();

  errorMessage: string = "";
  showSpinner: boolean = false;

  constructor(private securityProvider: SecurityProvider, private router: Router, private snackbarService: SnackbarService) { }

  ngOnInit(): void { }

  onSubmit() {
    let signupModel: SignupModel = new SignupModel(
      this.signupForm.get("email").value,
      this.signupForm.get("password").value, 
      this.signupForm.get("nickname").value);

    this.securityProvider.signup(signupModel);
    this.securityProvider.resultSignup.pipe(
      tap((res: Result) => {
        this.errorMessage = "";

        switch (res.Stage) {
          case ResultStage.WAITING:
            this.showSpinner = true;
            break;
            
          case ResultStage.SUCCESS:
            this.showSpinner = false;
            this.snackbarService.open("Konto zostało założone, musisz jeszcze je aktywować, na  Twój adres email wysłaliśmy link potwierdzający założenie konta.", 30000, SnackbarVariant.SUCCESS)
            this.router.navigate(['security/signin']);
            break;

          case ResultStage.ERROR:
            switch(res.Message) {
              case "Email is in use.":
                this.errorMessage = "Podany adres email jest zajęty.";
                break;
              case "Invalid data.":
                this.errorMessage = "Nieprawidłowy format danych.";
                break;
              case "Nickname is in use.":
                this.errorMessage = "Podana nazwa użytkownika jest zajęta.";
                break;
            }

            this.showSpinner = false;
            break;
        }
      })
    ).subscribe();
  }

  validForm(): boolean {
    if(this.signupForm.valid && (this.signupForm.get("password").value as string).length != 0 
    && (this.signupForm.get("confirmPassword").value as string).length != 0
    && this.signupForm.get("password").value === this.signupForm.get("confirmPassword").value)
      return true;

    return false;
  }

}
