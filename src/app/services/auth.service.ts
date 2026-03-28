import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BackendEndpoints } from '../constants/backend-endpoints';
import { Router } from '@angular/router';
import { AppRoutes } from '../constants/app-routes';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    // Check local storage or session storage for login state
    const storedToken = localStorage.getItem('token');
    if (storedToken && !this.isTokenExpired(storedToken)) {
      this.isLoggedInSubject.next(true);
    } else if (storedToken && this.isTokenExpired(storedToken)) {
      // Token exists but is expired - clear it
      this.logout();
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

  /**
   * Check if the JWT token is expired
   * @param token - The JWT token to check
   * @returns true if expired, false otherwise
   */
  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || localStorage.getItem('token');
    if (!tokenToCheck) {
      return true;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(tokenToCheck);
      if (!decoded.exp) {
        return false; // No expiration claim
      }

      const expirationDate = decoded.exp * 1000; // Convert to milliseconds
      const currentDate = Date.now();
      
      return currentDate >= expirationDate;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // If we can't decode, consider it expired
    }
  }

  /**
   * Get the token expiration date
   * @returns Date object or null
   */
  getTokenExpirationDate(): Date | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) {
        return null;
      }
      return new Date(decoded.exp * 1000);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is valid (exists and not expired)
   * @returns true if valid, false otherwise
   */
  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Decode the JWT token and return the full payload
   */
  private decodeToken(): any | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  /**
   * Get user roles from the JWT token
   */
  getUserRoles(): string[] {
    const decoded = this.decodeToken();
    return decoded?.roles ?? [];
  }

  /**
   * Check if the current user has a specific role
   */
  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  /**
   * Check if the current user has any of the given roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(r => userRoles.includes(r));
  }

  /**
   * Get the userId from the JWT token
   */
  getUserId(): number | null {
    const decoded = this.decodeToken();
    return decoded?.userId ?? null;
  }

  /**
   * Get the fullName from the JWT token
   */
  getFullName(): string {
    const decoded = this.decodeToken();
    return decoded?.fullName ?? '';
  }

  /**
   * Get the gender from the JWT token
   */
  getGender(): string {
    const decoded = this.decodeToken();
    return decoded?.gender ?? '';
  }

  /**
   * Validate an activation token (GET)
   */
  validateActivationToken(token: string): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.activate}?token=${token}`
    );
  }

  /**
   * Activate account by setting password (POST)
   */
  activateAccount(token: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${environment.memoApiUrl}${BackendEndpoints.activate}`,
      { token, password }
    );
  }

  /**
   * Resend activation email (POST)
   */
  resendActivation(email: string): Observable<any> {
    return this.http.post<any>(
      `${environment.memoApiUrl}${BackendEndpoints.resendActivation}?email=${email}`,
      {}
    );
  }

  /**
   * Request a password reset email (POST)
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(
      `${environment.memoApiUrl}${BackendEndpoints.forgotPassword}?email=${email}`,
      {}
    );
  }

  /**
   * Validate a password reset token (GET)
   */
  validateResetToken(token: string): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.validateResetToken}?token=${token}`
    );
  }

  /**
   * Reset password with token (POST)
   */
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${environment.memoApiUrl}${BackendEndpoints.resetPassword}`,
      { token, password }
    );
  }
}
