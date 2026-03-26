import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app/app-routing';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { httpInterceptorProviders } from './app/core/http/auth-handler-interceptor';
import { errorInterceptorProviders } from './app/core/http/error-handler-interceptor';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from "@angular/common";
import localeAr from '@angular/common/locales/ar';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';

registerLocaleData(localeAr);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, RouterModule.forRoot(APP_ROUTES), MatNativeDateModule),
    httpInterceptorProviders,
    errorInterceptorProviders,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'ar' },
    { provide: MAT_DATE_LOCALE, useValue: 'ar' }
  ],
}).catch((err) => console.error(err));
