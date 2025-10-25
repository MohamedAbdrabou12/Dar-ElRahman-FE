import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {BackendEndpoints} from "../../constants/backend-endpoints";
import {StudentAbsence} from "../../models/StudentAbsence.model";


@Injectable({
  providedIn: 'root',
})
export class StudentAbsenceService {
  constructor(private http: HttpClient) {}

  // Get all student absences
  getAllStudentAbsences(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.absence}`
    );
  }

  // Create a student absence
  createStudentAbsence(studentAbsent: any): Observable<StudentAbsence> {
    return this.http.post<any>(
      `${environment.memoApiUrl}${BackendEndpoints.student}/${studentAbsent?.studentId}/absences`,
      studentAbsent
    );
  }

  // Update a student absence
  updateStudentAbsence(studentAbsent: any): Observable<StudentAbsence> {
    return this.http.put<any>(
      `${environment.memoApiUrl}${BackendEndpoints.student}/${studentAbsent?.studentId}/absences`,
      studentAbsent
    );
  }

  // Delete a student absence by ID
  deleteStudentAbsence(studentAbsent: any): Observable<void> {
    return this.http.delete<void>(
      `${environment.memoApiUrl}${BackendEndpoints.student}/${studentAbsent?.studentId}/absences/${studentAbsent?.id}`
    );
  }

  // Get student absence details by ID
  getStudentAbsenceById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.absence}/${id}`
    );
  }
}
