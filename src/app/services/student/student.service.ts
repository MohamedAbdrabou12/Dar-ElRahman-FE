import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendEndpoints} from 'src/app/constants/backend-endpoints';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {
  }

  getAllStudent(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.student}`
    );
  }

  addStudent(student: any): Observable<any> {
    return this.http.post(
      `${environment.memoApiUrl}${BackendEndpoints.student}`,
      student
    );
  }

  updateStudent(student: any): Observable<any> {
    return this.http.put(
      `${environment.memoApiUrl}${BackendEndpoints.student}`,
      student
    );
  }

  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete(
      `${environment.memoApiUrl}${BackendEndpoints.student}/${studentId}`
    );
  }

  getStudentsNotInQuestionnaire(questionnaireId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.student}/not-in-questionnaire/${questionnaireId}`
    );
  }

  getNonGraduateStudents(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.student}/non-graduates`
    );
  }

  getCompletedSurahsByStudentId(studentId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.student}/${studentId}/completed-surah`
    );
  }

  getNonTuitionStudents(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.student}/non-graduates`
    );
  }
}
