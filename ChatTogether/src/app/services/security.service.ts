import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { SigninModel } from "../entities/Security/SigninModel";
import { User } from "../entities/user";
import { SignupModel } from "../entities/Security/SignupModel";

@Injectable({
    providedIn: 'root'
})

export class SecurityService {

    readonly url = `${environment.apiUrl}/Security`;

    constructor(private http: HttpClient) {}

    signup(signupModel: SignupModel): Observable<void> {
        return this.http.post<void>(`${this.url}/SignUp`, signupModel);
    }

    signin(signinModel: SigninModel): Observable<User> {
        return this.http.post<User>(`${this.url}/SignIn`, signinModel);
    }

    signout(): Observable<void> {
        return this.http.get<void>(`${this.url}/SignOut`);
    }

    validate(): Observable<User> {
        return this.http.get<User>(`${this.url}/Validate`);
    }

    //TODO: .
    changeEmail(token: string, newEmail: string): Observable<void> {
        return this.http.get<void>(`${this.url}/ChangeEmail?token=${token}&newEmail=${newEmail}`);
    }

    changePassword(token: string, newPassword: string): Observable<void> {
        return this.http.post<void>(`${this.url}/ChangePassword?token=${token}`, new Object(newPassword));
    }
    
    forgotPassword(email: string): Observable<void> {
        return this.http.post<void>(`${this.url}/ForgotPassword?email=${email}`, null);
    }

    //TODO: .
    confirmEmail(email: string, token: string): Observable<void> {
        return this.http.get<void>(`${this.url}/ConfirmEmail?email=${email}&token=${token}`);
    }

    //TODO: .
    resendConfirmationEmail(email: string): Observable<void> {
        return this.http.get<void>(`${this.url}/ResendConfirmationEmail?email${email}`);
    }

    //TODO: .
    changeEmailRequest(): Observable<void> {
        return this.http.get<void>(`${this.url}/ChangeEmailRequest`);
    }

    //TODO: .
    changePasswordRequest(): Observable<void> {
        return this.http.get<void>(`${this.url}/ChangePasswordRequest`);
    }
}