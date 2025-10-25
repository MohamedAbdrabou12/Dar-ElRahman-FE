import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthHandlerInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isPublicEndpoint(request)) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Token expired or invalid
            this.authService.logout(); // Clear session and logout
          }
          return throwError(() => error);
        })
      );
    } else {
      return next.handle(this.addRequiredHeaderProperties(request));
    }
  }

  isPublicEndpoint(request: HttpRequest<any>){
    return request.url.endsWith('/register') || request.url.endsWith('/authenticate');
  }

  private addRequiredHeaderProperties(
      request: HttpRequest<any>,
  ): HttpRequest<any> {

    const session_token = localStorage.getItem('token');

    let requestHeaders = {
      headers: request.headers
          .set('Authorization', 'Bearer ' + session_token)
    };

    return request.clone(requestHeaders);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthHandlerInterceptor, multi: true },
];
