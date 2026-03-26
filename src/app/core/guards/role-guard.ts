import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AppRoutes} from '../../constants/app-routes';

export function roleGuard(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles: string[] = route.data['roles'] ?? [];

  if (requiredRoles.length === 0) {
    return true;
  }

  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  // Redirect to default page if user doesn't have permission
  router.navigateByUrl(`/${AppRoutes.HOME}/${AppRoutes.STUDENT}`).then();
  return false;
}
