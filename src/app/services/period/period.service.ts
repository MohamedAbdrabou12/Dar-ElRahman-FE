import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendEndpoints } from 'src/app/constants/backend-endpoints';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PeriodService {
  constructor(private http: HttpClient) {}

  getAllPeriods(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.memoApiUrl}${BackendEndpoints.period}`
    );
  }
}
