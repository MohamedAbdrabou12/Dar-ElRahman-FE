import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BackendEndpoints } from '../constants/backend-endpoints';
import { Router } from '@angular/router';
import { AppRoutes } from '../constants/app-routes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    // Check local storage or session storage for login state
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.isLoggedInSubject.next(true);
    }
  }
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  register(user: any): Observable<any> {
    return this.http.post(
      `${environment.memoApiUrl}${BackendEndpoints.register}`,
      user
    );
  }

  login(credentials: any): Observable<any> {
    this.isLoggedInSubject.next(true);
    return this.http.post(
      `${environment.memoApiUrl}${BackendEndpoints.login}`,
      credentials
    );
  }
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  logout() {
    localStorage.clear();
    this.isLoggedInSubject.next(false);
    this.router.navigateByUrl(`/${AppRoutes.LOGIN}`).then();
  }
}
