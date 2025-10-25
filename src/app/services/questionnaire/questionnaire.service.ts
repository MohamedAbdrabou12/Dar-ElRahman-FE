import {HttpClient} from '@angular/common/http';
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

  getAllQuestionnaires(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.questionnaire}`
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
