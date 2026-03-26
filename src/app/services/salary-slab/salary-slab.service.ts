import {HttpClient} from '@angular/common/http';
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

  getAllSlabs(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.salarySlabs}`
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
}
