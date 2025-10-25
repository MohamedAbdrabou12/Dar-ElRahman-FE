import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendEndpoints} from 'src/app/constants/backend-endpoints';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GraduateService {
  constructor(private http: HttpClient) {
  }

  getAllGraduates(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.graduates}`
    );
  }

  deleteGraduate(graduateId: number): Observable<any> {
    return this.http.delete(
      `${environment.memoApiUrl}${BackendEndpoints.graduates}/${graduateId}`
    );
  }

  addGraduate(graduate: any): Observable<any> {
    return this.http.post(
      `${environment.memoApiUrl}${BackendEndpoints.graduates}`,
      graduate
    );
  }

  updateGraduate(graduate: any): Observable<any> {
    return this.http.put(
      `${environment.memoApiUrl}${BackendEndpoints.graduates}`,
      graduate
    );
  }

  getGraduatesByRingId(ringId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.graduates}/ring/${ringId}`
    );
  }
}
