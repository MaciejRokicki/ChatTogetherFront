import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { SigninModel } from "../entities/Security/SigninModel";
import { User } from "../entities/user";
import { SignupModel } from "../entities/Security/SignupModel";
import { Page } from "../entities/page";
import { BlockedUser } from "../entities/Security/blockedUser";
import { BlockUserModel } from "../entities/Security/blockUserModel";
import { ChangeRoleModel } from "../entities/Security/changeRoleModel";

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

    changeEmail(token: string, newEmail: string): Observable<void> {
        return this.http.put<void>(`${this.url}/ChangeEmail?token=${token}&newEmail=${newEmail}`, new Object(newEmail));
    }

    changePassword(token: string, newPassword: string): Observable<void> {
        return this.http.put<void>(`${this.url}/ChangePassword?token=${token}`, new Object(newPassword));
    }
    
    forgotPassword(email: string): Observable<void> {
        return this.http.put<void>(`${this.url}/ForgotPassword?email=${email}`, null);
    }

    confirmEmail(email: string, token: string): Observable<void> {
        return this.http.put<void>(`${this.url}/ConfirmEmail?email=${email}&token=${token}`, null);
    }

    resendConfirmationEmail(email: string): Observable<void> {
        return this.http.post<void>(`${this.url}/ResendConfirmationEmail?email=${email}`, null);
    }

    changeEmailRequest(): Observable<void> {
        return this.http.post<void>(`${this.url}/ChangeEmailRequest`, null);
    }

    changePasswordRequest(): Observable<void> {
        return this.http.post<void>(`${this.url}/ChangePasswordRequest`, null);
    }

    getBlockedUsers(page: number, search?: string): Observable<Page<BlockedUser>> {
        let u: string = `${this.url}/GetBlockedUsers?page=${page}`;

        if (search) {
            u += `&search=${search}`;
        }

        return this.http.get<Page<BlockedUser>>(u);
    }

    blockUser(blockUserModel: BlockUserModel): Observable<void> {
        return this.http.post<void>(`${this.url}/BlockUser`, blockUserModel)
    }

    unblockUser(userId: number): Observable<void> {
        return this.http.post<void>(`${this.url}/UnblockUser`, new Object(userId))
    }

    changeRole(changeRoleModel: ChangeRoleModel): Observable<void> {
        return this.http.post<void>(`${this.url}/ChangeRole`, changeRoleModel)
    }
}