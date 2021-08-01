import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Result } from 'src/app/entities/Result';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { DigitExistValidator } from 'src/app/validators/digitExistValidator';
import { SpecialCharValidator } from 'src/app/validators/specialCharValidator';
import { UpperCaseCharValidator } from 'src/app/validators/uppercaseCharValidator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
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

  //TODO: .
  constructor(
    private route: ActivatedRoute,
    private securityProvider: SecurityProvider
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
        if(res.Success === false) {
          this.infoMessage = "";
          switch(res.Message) {
            case "Incorrect data.":
              this.errorMessage = "Podano niepoprawne dane.";
              break;
            case "Invalid data.":
              this.errorMessage = "Nieprawidłowy format danych.";
              break;
          }
        } else if (res.Success === true) {
          this.infoMessage = "Hasło zostało zmienione.";
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
