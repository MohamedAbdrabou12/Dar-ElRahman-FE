import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendEndpoints } from 'src/app/constants/backend-endpoints';
import { environment } from 'src/environments/environment';
import { Period } from 'src/app/models/Period.model';

@Injectable({
  providedIn: 'root',
})
export class PeriodService {
  constructor(private http: HttpClient) {}

  getAllPeriods(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.period}`
    );
  }

  getPeriods(pageNo: number, pageSize: number, isAsc: boolean): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('isAsc', isAsc.toString());

    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.period}`,
      { params }
    );
  }

  getPeriod(periodId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.period}/${periodId}`
    );
  }

  addPeriod(period: Period): Observable<any> {
    return this.http.post<any>(
      `${environment.memoApiUrl}${BackendEndpoints.period}`,
      period
    );
  }

  updatePeriod(period: Period): Observable<any> {
    return this.http.put<any>(
      `${environment.memoApiUrl}${BackendEndpoints.period}`,
      period
    );
  }

  generateMonthlyBills(periodId: number): Observable<any> {
    return this.http.post<any>(
      `${environment.memoApiUrl}${BackendEndpoints.period}/${periodId}/billing`,
      {}
    );
  }

  deletePeriod(periodId: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.memoApiUrl}${BackendEndpoints.period}/${periodId}`
    );
  }
}
