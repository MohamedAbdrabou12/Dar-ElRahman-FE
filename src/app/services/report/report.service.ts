import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendEndpoints} from 'src/app/constants/backend-endpoints';
import {environment} from 'src/environments/environment';

export interface ReportDefinition {
  key: string;
  label: string;
  category: 'financial' | 'student' | 'teacher' | 'operational';
  icon: string;
  hasDateRange: boolean;
  hasPeriodFilter: boolean;
}

export const REPORT_DEFINITIONS: ReportDefinition[] = [
  // Financial
  {key: 'TUITION_COLLECTION', label: 'تقرير تحصيل الرسوم', category: 'financial', icon: 'fas fa-receipt', hasDateRange: true, hasPeriodFilter: false},
  {key: 'OUTSTANDING_TUITIONS', label: 'تقرير الرسوم المتأخرة', category: 'financial', icon: 'fas fa-exclamation-triangle', hasDateRange: true, hasPeriodFilter: true},
  {key: 'TEACHER_SALARY', label: 'تقرير رواتب المعلمين', category: 'financial', icon: 'fas fa-money-check-alt', hasDateRange: true, hasPeriodFilter: false},
  {key: 'REVENUE_SUMMARY', label: 'ملخص الإيرادات', category: 'financial', icon: 'fas fa-chart-pie', hasDateRange: true, hasPeriodFilter: false},

  // Student
  {key: 'ABSENCE', label: 'تقرير الغياب', category: 'student', icon: 'fas fa-user-times', hasDateRange: true, hasPeriodFilter: false},
  {key: 'STUDENT_PROGRESS', label: 'تقرير تقدم الطلبة', category: 'student', icon: 'fas fa-tasks', hasDateRange: false, hasPeriodFilter: false},
  {key: 'ENROLLMENT', label: 'تقرير القيد والتسجيل', category: 'student', icon: 'fas fa-clipboard-list', hasDateRange: false, hasPeriodFilter: true},
  {key: 'GRADUATE', label: 'تقرير الخريجين', category: 'student', icon: 'fas fa-graduation-cap', hasDateRange: false, hasPeriodFilter: false},

  // Teacher
  {key: 'TEACHER_PERFORMANCE', label: 'تقرير أداء المعلمين', category: 'teacher', icon: 'fas fa-chart-line', hasDateRange: true, hasPeriodFilter: false},
  {key: 'RING_ASSIGNMENT', label: 'تقرير توزيع الحلقات', category: 'teacher', icon: 'fas fa-sitemap', hasDateRange: false, hasPeriodFilter: false},

  // Operational
  {key: 'EXAM_SCHEDULE', label: 'تقرير جدول أسئلة القرآن', category: 'operational', icon: 'fas fa-calendar-check', hasDateRange: true, hasPeriodFilter: false},
  {key: 'PERIOD_SUMMARY', label: 'ملخص الفترات', category: 'operational', icon: 'fas fa-layer-group', hasDateRange: false, hasPeriodFilter: true},
];

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  downloadReport(
    reportType: string,
    format: 'PDF' | 'CSV',
    dateFrom?: string,
    dateTo?: string,
    periodId?: number
  ): Observable<Blob> {
    const reportKey = reportType.toLowerCase().replace(/_/g, '-');
    let params = new HttpParams().set('format', format);
    if (dateFrom) params = params.set('dateFrom', dateFrom);
    if (dateTo) params = params.set('dateTo', dateTo);
    if (periodId) params = params.set('periodId', periodId.toString());

    return this.http.get(
      `${environment.memoApiUrl}${BackendEndpoints.reports}/${reportKey}`,
      {params, responseType: 'blob'}
    );
  }
}
