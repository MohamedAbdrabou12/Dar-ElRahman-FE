import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {inject} from "@angular/core";
import {AppRoutes} from "../../constants/app-routes";

export function authGuard(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean | UrlTree {

  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (!token) {
    return router.parseUrl(`/${AppRoutes.LOGIN}`);
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      return router.parseUrl(`/${AppRoutes.LOGIN}`);
    }
  } catch {
    return router.parseUrl(`/${AppRoutes.LOGIN}`);
  }

  return true;
}
