import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { LoginModel } from "../entities/Security/LoginModel";
import { User } from "../entities/user";
import { RegistrationModel } from "../entities/Security/RegistrationModel";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    readonly url = `${environment.apiUrl}/Security`;

    constructor(private http: HttpClient) {}

    register(registrationModel: RegistrationModel): void {
        this.http.post(`${this.url}/SignUp`, registrationModel);
    }

    login(loginModel: LoginModel): Observable<User> {
        return this.http.post<User>(`${this.url}/SignIn`, loginModel);
    }

    logout(): void {
        this.http.get(`${this.url}/SignOut`);
    }

    validate(): Observable<User> {
        return this.http.get<User>(`${this.url}/Validate`);
    }
}