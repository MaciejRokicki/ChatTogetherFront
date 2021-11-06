import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { User } from "src/app/entities/user";
import { SecurityProvider } from "src/app/providers/security.provider";

@Injectable({
    providedIn: 'root'
})

export class AuthenticationGuard implements CanActivate {
    constructor(private securityProvider: SecurityProvider) {
        securityProvider.validate();
    }

    canActivate(): Observable<boolean> {
        return this.securityProvider.user.pipe(
            take(1),
            map((user: User) => {
                if(user) {
                    return true;
                } else {
                    return false;
                }
            })
        ) 
    } 
}