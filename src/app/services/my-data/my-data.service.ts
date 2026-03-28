import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendEndpoints } from 'src/app/constants/backend-endpoints';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyDataService {
  constructor(private http: HttpClient) {}

  // ===================== TEACHER ENDPOINTS =====================

  getMyRings(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.myData}/rings`
    );
  }

  getMyStudents(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.myData}/students`
    );
  }

  getMyTeacherResults(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.myData}/teacher-results`
    );
  }

  getMyStudentsAbsences(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.myData}/students-absences`
    );
  }

  getMyGraduates(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.myData}/graduates`
    );
  }

  // ===================== GUARDIAN ENDPOINTS =====================

  getMyStudent(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.myData}/student`
    );
  }

  getMyQuestionnaireResults(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.myData}/questionnaire-results`
    );
  }

  getMyAbsences(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.myData}/absences`
    );
  }

  getMyTuitions(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.myData}/tuitions`
    );
  }
}
