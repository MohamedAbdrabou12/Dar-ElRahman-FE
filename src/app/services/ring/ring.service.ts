import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendEndpoints } from 'src/app/constants/backend-endpoints';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RingService {
  constructor(private http: HttpClient) {}

  getAllRings(pageNo: number = 0, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.ring}`, { params }
    );
  }

  deleteRing(ringId: number): Observable<any> {
    return this.http.delete(
      `${environment.memoApiUrl}${BackendEndpoints.ring}/${ringId}`
    );
  }

  addRing(ring: any): Observable<any> {
    return this.http.post(
      `${environment.memoApiUrl}${BackendEndpoints.ring}`,
      ring
    );
  }

  updateRing(ring: any): Observable<any> {
    return this.http.put(
      `${environment.memoApiUrl}${BackendEndpoints.ring}`,
      ring
    );
  }
}
