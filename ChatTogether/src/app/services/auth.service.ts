import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { SigninModel } from "../entities/Security/SigninModel";
import { User } from "../entities/user";
import { SignupModel } from "../entities/Security/SignupModel";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    readonly url = `${environment.apiUrl}/Security`;

    constructor(private http: HttpClient) {}

    register(signupModel: SignupModel): void {
        this.http.post(`${this.url}/SignUp`, signupModel);
    }

    login(signinModel: SigninModel): Observable<User> {
        return this.http.post<User>(`${this.url}/SignIn`, signinModel);
    }

    logout(): void {
        this.http.get(`${this.url}/SignOut`);
    }

    validate(): Observable<User> {
        return this.http.get<User>(`${this.url}/Validate`);
    }
}