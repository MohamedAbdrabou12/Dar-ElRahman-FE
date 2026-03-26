import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StudentQuestionnaire } from 'src/app/models/StudentQuestionnaire.model';
import {BackendEndpoints} from "../../constants/backend-endpoints";

@Injectable({
  providedIn: 'root'
})
export class StudentQuestionnaireService {

  constructor(private http: HttpClient) { }

  getAllStudentQuestionnaires(pageNo: number = 0, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(`${environment.memoApiUrl}${BackendEndpoints.student_questionnaire}`, { params });
  }

  addStudentQuestionnaire(studentQuestionnaire: StudentQuestionnaire): Observable<StudentQuestionnaire> {
    return this.http.post<StudentQuestionnaire>(`${environment.memoApiUrl}${BackendEndpoints.student_questionnaire}`, studentQuestionnaire);
  }

  updateStudentQuestionnaire(studentQuestionnaire: StudentQuestionnaire): Observable<StudentQuestionnaire> {
    return this.http.put<StudentQuestionnaire>(`${environment.memoApiUrl}${BackendEndpoints.student_questionnaire}/${studentQuestionnaire.id}`, studentQuestionnaire);
  }

  deleteStudentQuestionnaire(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.memoApiUrl}${BackendEndpoints.student_questionnaire}/${id}`);
  }

  markStudentQuestionnaireAsDone(id: number): Observable<StudentQuestionnaire> {
    return this.http.put<StudentQuestionnaire>(`${environment.memoApiUrl}${BackendEndpoints.student_questionnaire}/${id}`, null);
  }

  getQuestionnairesByRing(ringId: number): Observable<any> {
    // Assuming an endpoint like this exists. We may need to adjust it.
    return this.http.get<any>(`${environment.memoApiUrl}${BackendEndpoints.student_questionnaire}/questionnaires/ring/${ringId}`);
  }

  getStudentsNotInQuestionnaire(questionnaireId: number): Observable<any> {
    // Assuming an endpoint like this exists. We may need to adjust it.
    return this.http.get<any>(`${environment.memoApiUrl}${BackendEndpoints.student_questionnaire}/students-not-in/${questionnaireId}`);
  }

  filter(params: any): Observable<any> {
    return this.http.get<any>(`${environment.memoApiUrl}${BackendEndpoints.student_questionnaire}/filter`, { params });
  }
}
