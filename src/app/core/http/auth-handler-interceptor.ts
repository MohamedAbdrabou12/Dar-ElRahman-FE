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
    // Public endpoints don't need token
    if (this.isPublicEndpoint(request)) {
      return next.handle(request);
    }
    
    // Protected endpoints - add token and handle expiration
    return next.handle(this.addRequiredHeaderProperties(request)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid - logout user
          console.warn('Token expired or unauthorized. Logging out...');
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
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
