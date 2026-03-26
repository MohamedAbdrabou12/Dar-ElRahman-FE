import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendEndpoints } from 'src/app/constants/backend-endpoints';
import { environment } from 'src/environments/environment';
import { Staff } from 'src/app/models/Staff.model';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  constructor(private http: HttpClient) {}

  getStaffById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.staff}/${id}`
    );
  }

  getAllStaff(pageNo: number = 0, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.staff}`,
      { params }
    );
  }

  createStaff(staff: Staff): Observable<any> {
    return this.http.post<any>(
      `${environment.memoApiUrl}${BackendEndpoints.staff}`,
      staff
    );
  }

  updateStaff(staff: Staff): Observable<any> {
    return this.http.put<any>(
      `${environment.memoApiUrl}${BackendEndpoints.staff}`,
      staff
    );
  }

  deleteStaff(id: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.memoApiUrl}${BackendEndpoints.staff}/${id}`
    );
  }
}
