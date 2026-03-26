import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendEndpoints} from 'src/app/constants/backend-endpoints';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(private http: HttpClient) {
  }

  getAllQuestionnaires(pageNo: number = 0, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.questionnaire}`, { params }
    );
  }

  deleteQuestionnaire(questionnaireId: number): Observable<any> {
    return this.http.delete(
      `${environment.memoApiUrl}${BackendEndpoints.questionnaire}/${questionnaireId}`
    );
  }

  addQuestionnaire(questionnaire: any): Observable<any> {
    return this.http.post(
      `${environment.memoApiUrl}${BackendEndpoints.questionnaire}`,
      questionnaire
    );
  }

  updateQuestionnaire(questionnaire: any): Observable<any> {
    return this.http.put(
      `${environment.memoApiUrl}${BackendEndpoints.questionnaire}`,
      questionnaire
    );
  }

  getLastDoneQuestionnaire(ringId: number, type: string): Observable<any> {
    const params = new HttpParams()
      .set('ringId', ringId.toString())
      .set('type', type);
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.questionnaire}/last-done`, { params }
    );
  }

  getQuestionnairesByRingId(ringId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.questionnaire}/ring/${ringId}`
    );
  }

  markStudentQuestionnaireAsDone(questionnaire: any): Observable<any> {
    return this.http.put(
      `${environment.memoApiUrl}${BackendEndpoints.questionnaire}/mark-as-done`,
      questionnaire
    );
  }
}
