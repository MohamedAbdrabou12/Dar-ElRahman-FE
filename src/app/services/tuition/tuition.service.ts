import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendEndpoints} from 'src/app/constants/backend-endpoints';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TuitionService {
  constructor(private http: HttpClient) {
  }

  getAllTuitions(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.tuitions}`
    );
  }

  deleteTuition(tuitionId: number): Observable<any> {
    return this.http.delete(
      `${environment.memoApiUrl}${BackendEndpoints.tuitions}/${tuitionId}`
    );
  }

  addTuition(tuition: any): Observable<any> {
    return this.http.post(
      `${environment.memoApiUrl}${BackendEndpoints.tuitions}`,
      tuition
    );
  }

  updateTuition(tuition: any): Observable<any> {
    return this.http.put(
      `${environment.memoApiUrl}${BackendEndpoints.tuitions}`,
      tuition
    );
  }

  getTuitionsByRingId(ringId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.tuitions}/ring/${ringId}`
    );
  }
}
