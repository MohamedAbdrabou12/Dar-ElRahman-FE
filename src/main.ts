import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app/app-routing';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { httpInterceptorProviders } from './app/core/http/auth-handler-interceptor';
import { LOCALE_ID } from '@angular/core';
import {registerLocaleData} from "@angular/common";
import localeAr from '@angular/common/locales/ar';

registerLocaleData(localeAr);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, RouterModule.forRoot(APP_ROUTES)),
    httpInterceptorProviders,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'ar' }
  ],
}).catch((err) => console.error(err));
