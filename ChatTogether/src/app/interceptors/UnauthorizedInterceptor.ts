import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthProvider } from '../providers/auth.provider';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authProvider: AuthProvider) {
    console.log("UNAUTH_INTER");
   }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({ withCredentials: true });
    
    return next.handle(request).pipe(
      catchError((err: Error) => {
        if(err['status'] === 401) {
          console.log("401_UNAUTH");
          this.authProvider.user.next(null);
          this.authProvider.user.subscribe(x => console.log(x));
          this.router.navigate(['/security/signin']);
        }
        return throwError(err);
      })
    );
  }
}