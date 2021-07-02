import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
import { tap } from 'rxjs/operators';
import { Result } from 'src/app/entities/Result';
import { LoginModel } from 'src/app/entities/Security/LoginModel';

import { AuthProvider } from 'src/app/providers/auth.provider';
import { DigitExistValidator } from 'src/app/validators/digitExistValidator';
import { UpperCaseCharValidator } from 'src/app/validators/uppercaseCharValidator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), UpperCaseCharValidator(), DigitExistValidator()]),
  });

  errorMessage: string = "";
  
  constructor(private authProvider: AuthProvider, private router: Router) { }

  ngOnInit(): void {
    new MDCTextField(document.getElementById('emailField') as Element);
    new MDCTextField(document.getElementById('passwordField') as Element);
    new MDCRipple(document.getElementById("registerButton") as Element);
  }

  onSubmit() {
    let loginModel: LoginModel = new LoginModel(this.loginForm.get("email").value, this.loginForm.get("password").value);
    this.authProvider.login(loginModel);
    //TODO: pomyslec nad kodami zamiast na sztywno podawac tresc wiadomosci
    this.authProvider.result.pipe(
      tap((res: Result) => {
        if(!res.Success) {
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

  navigateToRegistrationPage() {
    this.router.navigate(['register']);
  }

}
