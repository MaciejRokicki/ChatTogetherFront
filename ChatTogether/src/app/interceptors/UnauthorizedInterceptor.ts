import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SecurityProvider } from '../providers/security.provider';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private router: Router, private securityProvider: SecurityProvider) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({ withCredentials: true });
    
    return next.handle(request).pipe(
      catchError((err: Error) => {
        if(err['status'] === 401) {
          this.securityProvider.user.next(null);

          this.router.navigate(['/security/signin']);
          document.body.classList.remove("dark-theme");
          document.body.classList.add("light-theme");
        }
        return throwError(err);
      })
    );
  }
}