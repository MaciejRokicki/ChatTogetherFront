import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { map, take } from "rxjs/operators";
import { User } from "src/app/entities/user";
import { AuthProvider } from "src/app/providers/auth.provider";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private authProvider: AuthProvider, private router: Router) { }

    canActivate = () => 
        this.authProvider.user$.pipe(
            take(1),
            map((user: User) => {
                if(user) {
                    return true;
                } else {
                    this.router.navigate(['/login']);
                    return false;
                }
            })
        ) 
}