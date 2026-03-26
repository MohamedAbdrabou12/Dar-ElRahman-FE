import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendEndpoints} from 'src/app/constants/backend-endpoints';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.profile}`
    );
  }

  updateProfilePicture(profilePictureUrl: string): Observable<any> {
    return this.http.put<any>(
      `${environment.memoApiUrl}${BackendEndpoints.profile}/picture`,
      {profilePictureUrl}
    );
  }

  updateGender(gender: string): Observable<any> {
    return this.http.put<any>(
      `${environment.memoApiUrl}${BackendEndpoints.profile}/gender`,
      {gender}
    );
  }
}
