import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  // GET 요청
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.configService.apiUrl}${endpoint}`);
  }

  // POST 요청
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.configService.apiUrl}${endpoint}`, data);
  }

  // PUT 요청
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.configService.apiUrl}${endpoint}`, data);
  }

  // DELETE 요청
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.configService.apiUrl}${endpoint}`);
  }

  // 파일 업로드
  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.configService.apiUrl}${endpoint}`, formData);
  }
}  