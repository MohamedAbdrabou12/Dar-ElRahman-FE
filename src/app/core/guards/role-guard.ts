import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AppRoutes} from '../../constants/app-routes';

export function roleGuard(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean | UrlTree {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles: string[] = route.data['roles'] ?? [];

  if (requiredRoles.length === 0) {
    return true;
  }

  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  // Redirect to role-appropriate default page using UrlTree to avoid race conditions
  const defaultRoute = getDefaultRouteForRole(authService);
  const targetUrl = `/${AppRoutes.HOME}/${defaultRoute}`;

  // Prevent infinite loop: if we're already heading to the target, allow through
  if (state.url === targetUrl) {
    return true;
  }

  return router.parseUrl(targetUrl);
}

export function getDefaultRouteForRole(authService: AuthService): string {
  if (authService.hasRole('ADMIN') || authService.hasRole('SUPERVISOR')) {
    return AppRoutes.ADMIN_DASHBOARD;
  }
  if (authService.hasRole('TECHNICAL')) {
    return AppRoutes.STUDENT;
  }
  if (authService.hasRole('TEACHER')) {
    return AppRoutes.STUDENT;
  }
  if (authService.hasRole('GUARDIAN')) {
    return AppRoutes.GUARDIAN_DASHBOARD;
  }
  // Fallback: use student page if user has ANY role
  // to avoid looping back to a page they can't access
  return AppRoutes.STUDENT;
}
