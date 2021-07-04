import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
import { tap } from 'rxjs/operators';
import { Result } from 'src/app/entities/Result';
import { SigninModel } from 'src/app/entities/Security/SigninModel';

import { SecurityProvider } from 'src/app/providers/security.provider';
import { DigitExistValidator } from 'src/app/validators/digitExistValidator';
import { SpecialCharValidator } from 'src/app/validators/specialCharValidator';
import { UpperCaseCharValidator } from 'src/app/validators/uppercaseCharValidator';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
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

  errorMessage: string = "";
  
  constructor(private securityProvider: SecurityProvider, private router: Router) { }

  ngOnInit(): void {
    new MDCTextField(document.getElementById('emailField') as Element);
    new MDCTextField(document.getElementById('passwordField') as Element);
    new MDCRipple(document.getElementById("signupButton") as Element);
  }

  onSubmit() {
    let signinModel: SigninModel = new SigninModel(this.signinForm.get("email").value, this.signinForm.get("password").value);
    this.securityProvider.signin(signinModel);
    //TODO: pomyslec nad kodami zamiast na sztywno podawac tresc wiadomosci
    this.securityProvider.result.pipe(
      tap((res: Result) => {
        if(res.Success === false) {
          switch(res.Message) {
            case "Incorrect data.":
              this.errorMessage = "Podano niepoprawne dane.";
              break;
            case "Unconfirmed account.":
              this.errorMessage = "Konto nie zostało jeszcze potwierdzone.";
              break;
            case "Invalid data.":
              this.errorMessage = "Nieprawidłowy format danych.";
              break;
          }
        }
      })
    ).subscribe();
  }

  navigateToSignUpPage() {
    this.router.navigate(['security/signup']);
  }

}
