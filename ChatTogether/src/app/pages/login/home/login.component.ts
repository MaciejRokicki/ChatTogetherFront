import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';

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
    this.authProvider.login(this.loginForm.get("email").value, this.loginForm.get("password").value);
    this.router.navigate(['']);
  }

  navigateToRegisterPage() {
    this.router.navigate(['register']);
  }

}
