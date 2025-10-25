import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendEndpoints } from 'src/app/constants/backend-endpoints';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<any> {
    return this.http.get<any>(
      `${environment.memoApiUrl}${BackendEndpoints.teacher}`
    );
  }

  deleteTeacher(teacherId: number): Observable<any> {
    return this.http.delete(
      `${environment.memoApiUrl}${BackendEndpoints.teacher}/${teacherId}`
    );
  }

  addTeacher(teacher: any): Observable<any> {
    return this.http.post(
      `${environment.memoApiUrl}${BackendEndpoints.teacher}`,
      teacher
    );
  }

  updateTeacher(teacher: any): Observable<any> {
    return this.http.put(
      `${environment.memoApiUrl}${BackendEndpoints.teacher}`,
      teacher
    );
  }
}
