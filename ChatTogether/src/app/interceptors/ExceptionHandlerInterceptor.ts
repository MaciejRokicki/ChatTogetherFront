import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SnackbarVariant } from '../components/snackbar/snackbar.data';
import { SnakcbarService } from '../services/snackbar.service';

@Injectable()
export class ExceptionHandlerInterceptor implements HttpInterceptor {
  constructor(
      private snackbarService: SnakcbarService
      ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({ withCredentials: true });
    
    return next.handle(request).pipe(
      catchError((err: Error) => {
        let errorCode = err['status'];

        if(errorCode !== 401) {
            this.snackbarService.open(`[Błąd: ${errorCode}] Ups, coś poszło nie tak :(`, 30000, SnackbarVariant.ERROR)
        }
        return throwError(err);
      })
    );
  }
}