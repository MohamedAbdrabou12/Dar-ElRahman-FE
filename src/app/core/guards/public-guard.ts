import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {inject} from "@angular/core";
import {AppRoutes} from "../../constants/app-routes";
import {AuthService} from "../../services/auth.service";
import {getDefaultRouteForRole} from "./role-guard";

export function publicGuard(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean | UrlTree {

  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded?.exp && decoded.exp * 1000 >= Date.now()) {
      const defaultRoute = getDefaultRouteForRole(authService);
      return router.parseUrl(`/${AppRoutes.HOME}/${defaultRoute}`);
    }
  } catch {
    // Invalid token — allow access to public page
  }
  return true;
}
