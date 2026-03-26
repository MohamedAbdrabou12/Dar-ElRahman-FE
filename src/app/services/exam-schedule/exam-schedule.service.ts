import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendEndpoints} from 'src/app/constants/backend-endpoints';
import {environment} from 'src/environments/environment';
import {ExamDistributionRequest} from 'src/app/models/ExamSchedule.model';

@Injectable({
  providedIn: 'root',
})
export class ExamScheduleService {
  constructor(private http: HttpClient) {
  }

  distributeStudents(request: ExamDistributionRequest): Observable<any> {
    return this.http.post<any>(
      `${environment.memoApiUrl}${BackendEndpoints.examSchedule}/distribute`,
      request
    );
  }

  getScheduleByQuestionnaire(questionnaireId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.examSchedule}/questionnaire/${questionnaireId}`
    );
  }

  getTodaySchedule(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.examSchedule}/today`
    );
  }

  getScheduleByDate(date: string): Observable<any> {
    const params = new HttpParams().set('date', date);
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.examSchedule}/by-date`, {params}
    );
  }

  getScheduleByDateRange(fromDate: string, toDate: string): Observable<any> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.examSchedule}/by-date-range`, {params}
    );
  }

  getScheduleByRingAndDateRange(ringId: number, fromDate: string, toDate: string): Observable<any> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.examSchedule}/ring/${ringId}`, {params}
    );
  }

  updateExamStatus(scheduleId: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put<any>(
      `${environment.memoApiUrl}${BackendEndpoints.examSchedule}/${scheduleId}/status`, null, {params}
    );
  }

  cancelExamSchedule(scheduleId: number): Observable<any> {
    return this.http.put<any>(
      `${environment.memoApiUrl}${BackendEndpoints.examSchedule}/${scheduleId}/cancel`, null
    );
  }
}
