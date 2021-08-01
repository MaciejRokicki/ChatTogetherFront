import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';
import { Result } from 'src/app/entities/Result';
import { SignupModel } from 'src/app/entities/Security/SignupModel';

import { SecurityProvider } from 'src/app/providers/security.provider';
import { DigitExistValidator } from 'src/app/validators/digitExistValidator';
import { SpecialCharValidator } from 'src/app/validators/specialCharValidator';
import { UpperCaseCharValidator } from 'src/app/validators/uppercaseCharValidator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
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

  errorMessage: string = "";
  nicknameInfo: string = "";
  passwordInfo: string = "";
  
  constructor(private securityProvider: SecurityProvider, private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit() {
    let signupModel: SignupModel = new SignupModel(
      this.signupForm.get("email").value,
      this.signupForm.get("password").value, 
      this.signupForm.get("nickname").value);

    this.securityProvider.signup(signupModel);
    this.securityProvider.result.pipe(
      tap((res: Result) => {
        if(res.Success === false) {
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
        }
      })
    ).subscribe();
    this.router.navigate(['']);
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
