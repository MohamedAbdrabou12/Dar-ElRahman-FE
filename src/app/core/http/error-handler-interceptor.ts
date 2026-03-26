import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private alertService: AlertService,
    private loadingService: LoadingService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // Handle 2xx responses where backend indicates failure
      tap((event) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (body && body.successful === false) {
            this.loadingService.stopLoading();
            const message =
              body.errorDescription || 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.';
            this.alertService.error(message);
          }
        }
      }),
      // Handle HTTP error responses (4xx, 5xx, network errors)
      catchError((error: HttpErrorResponse) => {
        // Skip 401 — handled by AuthHandlerInterceptor
        if (error.status === 401) {
          return throwError(() => error);
        }

        this.loadingService.stopLoading();

        let message = 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.';

        if (error.error && typeof error.error === 'object') {
          // Backend returned structured error response
          if (error.error.errorDescription) {
            message = error.error.errorDescription;
          } else if (error.error.message) {
            message = error.error.message;
          }
        } else if (error.status === 0) {
          message = 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت.';
        } else if (error.status === 403) {
          message = 'ليس لديك صلاحية للوصول إلى هذا المورد.';
        } else if (error.status === 404) {
          message = 'المورد المطلوب غير موجود.';
        } else if (error.status >= 500) {
          message = 'حدث خطأ في الخادم. الرجاء المحاولة لاحقاً.';
        }

        this.alertService.error(message);
        return throwError(() => error);
      })
    );
  }
}

export const errorInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorHandlerInterceptor,
    multi: true,
  },
];
