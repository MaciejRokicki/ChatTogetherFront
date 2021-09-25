import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';
import { SecurityProvider } from 'src/app/providers/security.provider';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../security.scss', './forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  infoMessage: string = "";
  successMessage: string = "";
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
        this.infoMessage = "";
        this.successMessage = "";
        this.errorMessage = "";

        switch (res.Stage) {
          case ResultStage.SUCCESS:
            this.successMessage = "Link do zmiany hasła został wysłany na podany adres email.";
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
}