import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendEndpoints} from 'src/app/constants/backend-endpoints';
import {environment} from 'src/environments/environment';
import {SalarySlab} from 'src/app/models/SalarySlab.model';

@Injectable({
  providedIn: 'root',
})
export class SalarySlabService {
  constructor(private http: HttpClient) {
  }

  getSlabs(periodId?: number): Observable<any> {
    let params = new HttpParams();
    if (periodId) params = params.set('periodId', periodId.toString());
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.salarySlabs}`,
      {params}
    );
  }

  createSlab(slab: SalarySlab): Observable<any> {
    return this.http.post<any>(
      `${environment.memoApiUrl}${BackendEndpoints.salarySlabs}`,
      slab
    );
  }

  updateSlab(slabId: number, slab: SalarySlab): Observable<any> {
    return this.http.put<any>(
      `${environment.memoApiUrl}${BackendEndpoints.salarySlabs}/${slabId}`,
      slab
    );
  }

  updateAllSlabs(slabs: SalarySlab[]): Observable<any> {
    return this.http.put<any>(
      `${environment.memoApiUrl}${BackendEndpoints.salarySlabs}`,
      slabs
    );
  }

  deleteSlab(slabId: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.memoApiUrl}${BackendEndpoints.salarySlabs}/${slabId}`
    );
  }
}
