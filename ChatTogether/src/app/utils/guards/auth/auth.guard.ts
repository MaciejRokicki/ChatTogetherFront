import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { map, take } from "rxjs/operators";
import { User } from "src/app/entities/user";
import { SecurityProvider } from "src/app/providers/security.provider";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private securityProvider: SecurityProvider, private router: Router) {
        console.log("AUTH_GUARD");
        securityProvider.validate();
     }

    canActivate() {      
        return this.securityProvider.user.pipe(
            take(1),
            map((user: User) => {
                if(user) {
                    return true;
                } else {
                    //this.router.navigate(['/login']);
                    return false;
                }
            })
        ) 
    } 

}