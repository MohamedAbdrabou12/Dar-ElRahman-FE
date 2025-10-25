import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {inject} from "@angular/core";
import {AppRoutes} from "../../constants/app-routes";

export function publicGuard(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean> {

  const router = inject(Router);
  const decodedSessionToken = localStorage.getItem('token') ? jwtDecode<JwtPayload>(localStorage.getItem('token')!) : undefined;

  return new Promise(async (resolve, reject) => {
    if (decodedSessionToken && (decodedSessionToken?.exp && decodedSessionToken.exp * 1000 >= Date.now())) {
      router.navigateByUrl(`/${AppRoutes.HOME}/${AppRoutes.STUDENT}`).then();
      return resolve(false);
    }
    resolve(true);
  });
}
