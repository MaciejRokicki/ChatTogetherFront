import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Result } from 'src/app/entities/Result';
import { SecurityProvider } from 'src/app/providers/security.provider';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  infoMessage: string = "";
  errorMessage: string = "";
  
  constructor(
    private securityProvider : SecurityProvider
  ) { }

  ngOnInit(): void {
  
  }

  onSubmit() {
    let email = this.forgotPasswordForm.get("email").value;
    this.securityProvider.forgotPassword(email);
    this.securityProvider.result.pipe(
      tap((res: Result) => {
        //this.errorMessage = "";     
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
          this.infoMessage = "Link do zmiany hasła został wysłany na podany adres email.";
          this.errorMessage = "";
        }
      })
    ).subscribe();
  }
}