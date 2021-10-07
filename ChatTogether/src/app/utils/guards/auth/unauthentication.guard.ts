import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { map, take } from "rxjs/operators";
import { User } from "src/app/entities/user";
import { SecurityProvider } from "src/app/providers/security.provider";

@Injectable({
    providedIn: 'root'
})

export class UnauthenticationGuard implements CanActivate {
    constructor(private securityProvider: SecurityProvider) { }

    canActivate() {      
        return this.securityProvider.user.pipe(
            take(1),
            map((user: User) => {
                if(user) {
                    return false;
                } else {
                    return true;
                }
            })
        ) 
    } 

}