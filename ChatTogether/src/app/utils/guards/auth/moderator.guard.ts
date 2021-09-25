import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { map, take } from "rxjs/operators";
import { Role, User } from "src/app/entities/user";
import { SecurityProvider } from "src/app/providers/security.provider";

@Injectable({
    providedIn: 'root'
})

export class ModeratorGuard implements CanActivate {
    constructor(private securityProvider: SecurityProvider) {
        securityProvider.validate();
     }

    canActivate() {      
        return this.securityProvider.user.pipe(
            take(1),
            map((user: User) => {
                if(user?.role === Role.MODERATOR || user?.role === Role.ADMINISTRATOR) {
                    return true;
                } else {
                    return false;
                }
            })
        ) 
    } 

}