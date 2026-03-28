import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendEndpoints} from 'src/app/constants/backend-endpoints';
import {environment} from 'src/environments/environment';

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalTeachers: number;
  activeTeachers: number;
  outOfWorkTeachers: number;
  totalRings: number;
  totalPeriods: number;
  totalQuestionnaires: number;
  completedQuestionnaires: number;
  pendingQuestionnaires: number;
  examsScheduledToday: number;
  pendingExamsToday: number;
  totalGraduates: number;
  absencesThisMonth: number;
  tuitionsThisMonth: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.dashboard}`
    );
  }
}
