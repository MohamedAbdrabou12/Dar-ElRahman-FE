import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendEndpoints } from 'src/app/constants/backend-endpoints';
import { environment } from 'src/environments/environment';
import {Surah} from "../../models/Surah.model";

@Injectable({
  providedIn: 'root',
})
export class SurahsService {
  constructor(private http: HttpClient) {}

  getAllSurahs(): Observable<any> {
    return this.http.get<Surah>(
      `${environment.memoApiUrl}${BackendEndpoints.surahs}`
    );
  }
}
