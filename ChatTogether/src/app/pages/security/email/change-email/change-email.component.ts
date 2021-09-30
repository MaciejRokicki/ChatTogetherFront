import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';
import { SecurityProvider } from 'src/app/providers/security.provider';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['../../security.scss', './change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {
  changeEmailForm = new FormGroup({
    newEmail: new FormControl('', [Validators.required, Validators.email])
  });

  successMessage: string = "";
  errorMessage: string = "";

  showSpinner: boolean = false;

  result$: Subscription;

  email: string;
  token: string;
  params$: Subscription;

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
    let newEmail = this.changeEmailForm.get("newEmail").value;
    this.securityProvider.changeEmail(this.token, newEmail);
    this.result$ = this.securityProvider.resultChangeEmail.pipe(
      tap((res: Result) => {
        this.successMessage = "";
        this.errorMessage = "";

        switch (res.Stage) {
          case ResultStage.WAITING:
            this.showSpinner = true;
            break;
            
          case ResultStage.SUCCESS:
            this.successMessage = "Adres email został zmieniony. Sprawdź nowy adres email w celu potwierdzenia adresu.";
            this.showSpinner = false;
            break;

          case ResultStage.ERROR:
            switch (res.Message) {
              case "Incorrect data.":
                this.errorMessage = "Podano niepoprawne dane.";
                break;
              case "Email is in use.":
                this.errorMessage = "Podany adres email jest zajęty.";
                break;
              case "Invalid data.":
                this.errorMessage = "Nieprawidłowy format danych.";
                break;
            }
            this.showSpinner = false;
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
