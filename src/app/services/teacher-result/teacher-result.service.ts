import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendEndpoints } from 'src/app/constants/backend-endpoints';
import { environment } from 'src/environments/environment';
import {TeacherResult} from "../../models/TeacherResult.model";

@Injectable({
  providedIn: 'root',
})
export class TeacherResultService {
  constructor(private http: HttpClient) {}

  getAllTeacherResults(pageNo: number = 0, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.teacher_result}`, { params }
    );
  }

  deleteTeacherResult(teacherResultId: number): Observable<any> {
    return this.http.delete(
      `${environment.memoApiUrl}${BackendEndpoints.teacher_result}/${teacherResultId}`
    );
  }

  addTeacherResult(teacherResult: any): Observable<any> {
    return this.http.post(
      `${environment.memoApiUrl}${BackendEndpoints.teacher_result}`,
      teacherResult
    );
  }

  updateTeacherResult(teacherResult: TeacherResult): Observable<TeacherResult> {
    return this.http.put(
      `${environment.memoApiUrl}${BackendEndpoints.teacher_result}`,
      teacherResult
    );
  }

  triggerResultCalculation(): Observable<any> {
    return this.http.post(
      `${environment.memoApiUrl}${BackendEndpoints.teacher_result}/trigger-teacher-result-calculations`,
      {}
    );
  }
}
