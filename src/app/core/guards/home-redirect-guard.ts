import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AppRoutes} from '../../constants/app-routes';

export function homeRedirectGuard(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean {
  const authService = inject(AuthService);
  const router = inject(Router);

  let defaultRoute = AppRoutes.STUDENT;

  if (authService.hasRole('TEACHER')) {
    defaultRoute = AppRoutes.TEACHER_DASHBOARD;
  } else if (authService.hasRole('GUARDIAN')) {
    defaultRoute = AppRoutes.GUARDIAN_DASHBOARD;
  }

  router.navigateByUrl(`/${AppRoutes.HOME}/${defaultRoute}`).then();
  return false;
}
