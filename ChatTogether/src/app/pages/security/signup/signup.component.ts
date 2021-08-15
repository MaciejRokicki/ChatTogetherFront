import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, of } from 'rxjs';

import { delayWhen, tap } from 'rxjs/operators';
import { SnackbarVariant } from 'src/app/components/snackbar/snackbar.data';
import { Result, ResultStage } from 'src/app/entities/Result';
import { SignupModel } from 'src/app/entities/Security/SignupModel';

import { SecurityProvider } from 'src/app/providers/security.provider';
import { SnackbarService } from 'src/app/services/snackbar.service';
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
    password: new FormControl('', [Validators.required, Validators.minLength(6), UpperCaseCharValidator(), DigitExistValidator()]),
    confirmPassword: new FormControl('', [
      Validators.required, 
      Validators.minLength(6), 
      UpperCaseCharValidator(), 
      DigitExistValidator(),
      SpecialCharValidator()
    ]),
  });

  infoMessage: string = "";
  errorMessage: string = "";

  nicknameInfo: string = "";
  passwordInfo: string = "";
  
  constructor(private securityProvider: SecurityProvider, private router: Router, private snackbarService: SnackbarService) { }

  ngOnInit(): void { }

  onSubmit() {
    let signupModel: SignupModel = new SignupModel(
      this.signupForm.get("email").value,
      this.signupForm.get("password").value, 
      this.signupForm.get("nickname").value);

    this.securityProvider.signup(signupModel);
    this.securityProvider.result.pipe(
      tap((res: Result) => {
        this.infoMessage = "";
        this.errorMessage = "";

        switch (res.Stage) {
          case ResultStage.SUCCESS:
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
            break;

          case ResultStage.WAITING:
            this.infoMessage = "Daj nam chwilę, pracujemy nad tym...";
            break;
        }
      })
    ).subscribe();
  }

  showNicknameInfo(): void {
    this.nicknameInfo = "Przynajmniej 3 znaki.";
  }

  showPasswordInfo(): void {
    this.passwordInfo = "Przynajmniej 6 znaków, jedna wielka litera, jedna cyfra i jeden znak specjalny.";
  }

  clearInfo(): void {
    this.nicknameInfo = "";
    this.passwordInfo = "";
  }

  validForm(): boolean {
    if(this.signupForm.valid && (this.signupForm.get("password").value as string).length != 0 
    && (this.signupForm.get("confirmPassword").value as string).length != 0
    && this.signupForm.get("password").value === this.signupForm.get("confirmPassword").value)
      return true;

    return false;
  }

}
