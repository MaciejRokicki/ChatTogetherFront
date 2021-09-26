import { Observable } from 'rxjs';
import { environment } from "src/environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Role, User } from "../entities/user";
import { Page } from '../entities/page';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    readonly url = `${environment.apiUrl}/User`;

    constructor(private http: HttpClient) { }

    getUser(nickname: string): Observable<User> {
        return this.http.get<User>(`${this.url}/GetUser?nickname=${nickname}`);
    }

    getUsers(page: number, search?: string, role?: Role): Observable<Page<User>> {
        let u: string = `${this.url}/GetUsers?page=${page}`;

        if (search) {
            u += `&search=${search}`;
        }

        if (role) {
            u += `&role=${role}`;
        }

        return this.http.get<Page<User>>(u);
    }

    changeNickname(nickname: string): Observable<void> {
        return this.http.put<void>(`${this.url}/ChangeNickname`, new Object(nickname));
    }

    changeUserData(user: User): Observable<User> {
        return this.http.put<User>(`${this.url}/ChangeUserData`, user);
    }
}