import { Routes } from '@angular/router';
import { AppRoutes } from './constants/app-routes';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';

export const APP_ROUTES: Routes = [
  {
    path: AppRoutes.REGISTRATION,
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./components/registration/registration.component').then(
        (c) => c.RegistrationComponent
      ),
  },
  {
    path: AppRoutes.LOGIN,
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent
      )
  },
  {
    path: AppRoutes.HOME,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/home/home.component').then(
        (c) => c.HomeComponent,
      ),
    loadChildren: () =>
      import('./components/home/home-routing').then(
        (routes) => routes.HOME_CHILDREN_ROUTES,
      ),
  },
  {
    path: '',
    redirectTo: AppRoutes.LOGIN,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: AppRoutes.LOGIN, pathMatch: 'full' },
];
