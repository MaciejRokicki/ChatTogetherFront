import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
import { RegistrationModel } from 'src/app/entities/Security/RegistrationModel';

import { AuthProvider } from 'src/app/providers/auth.provider';
import { DigitExistValidator } from 'src/app/validators/digitExistValidator';
import { UpperCaseCharValidator } from 'src/app/validators/uppercaseCharValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    nickname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), UpperCaseCharValidator(), DigitExistValidator()]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), UpperCaseCharValidator(), DigitExistValidator()]),
  });

  errorMessage: string = "";
  nicknameInfo: string = "";
  passwordInfo: string = "";
  
  constructor(private authProvider: AuthProvider, private router: Router) { }

  ngOnInit(): void {
    new MDCTextField(document.getElementById('emailField') as Element);
    new MDCTextField(document.getElementById('passwordField') as Element);
    new MDCTextField(document.getElementById('confirmPasswordField') as Element);
    new MDCTextField(document.getElementById('nicknameField') as Element);
    new MDCRipple(document.getElementById("registerButton") as Element);
  }

  onSubmit() {

    let registrationModel: RegistrationModel = new RegistrationModel(
      this.registerForm.get("email").value,
      this.registerForm.get("password").value, 
      this.registerForm.get("nickname").value);

    this.authProvider.register(registrationModel);
    this.router.navigate(['']);
  }

  showNicknameInfo(): void {
    this.nicknameInfo = "Nazwa użytkownika musi składać sie z przynajmniej 3 znaków.";
  }

  showPasswordInfo(): void {
    this.passwordInfo = "Hasło musi się składać z przynajmniej 6 znaków, jednej wielkiej litery i jednej cyfry.";
  }

  clearInfo(): void {
    this.nicknameInfo = "";
    this.passwordInfo = "";
  }

  validForm(): boolean {
    if(this.registerForm.valid && (this.registerForm.get("password").value as string).length != 0 
    && (this.registerForm.get("confirmPassword").value as string).length != 0
    && this.registerForm.get("password").value === this.registerForm.get("confirmPassword").value)
      return true;

    return false;
  }

}
