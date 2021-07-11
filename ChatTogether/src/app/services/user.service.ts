import { Observable } from 'rxjs';
import { environment } from "src/environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../entities/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    readonly url = `${environment.apiUrl}/User`;

    constructor(private http: HttpClient) { }

    getUser(nickname: string): Observable<User> {
        return this.http.get<User>(`${this.url}/GetUser?nickname=${nickname}`);
    }

    changeNickname(nickname: string): Observable<void> {
        return this.http.put<void>(`${this.url}/ChangeNickname`, new Object(nickname));
    }

    changeUserData(user: User): Observable<User> {
        return this.http.put<User>(`${this.url}/ChangeUserData`, user);
    }
}