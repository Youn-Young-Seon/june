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
  ) {}

  // GET 요청
  get<T>(endpoint: string): Observable<T> {
    return this.configService.loadConfig().pipe(
      switchMap(config => 
        this.http.get<T>(`${config.apiUrl}${endpoint}`)
      )
    );
  }

  // POST 요청
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.configService.loadConfig().pipe(
      switchMap(config => 
        this.http.post<T>(`${config.apiUrl}${endpoint}`, data)
      )
    );
  }

  // PUT 요청
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.configService.loadConfig().pipe(
      switchMap(config => 
        this.http.put<T>(`${config.apiUrl}${endpoint}`, data)
      )
    );
  }

  // DELETE 요청
  delete<T>(endpoint: string): Observable<T> {
    return this.configService.loadConfig().pipe(
      switchMap(config => 
        this.http.delete<T>(`${config.apiUrl}${endpoint}`)
      )
    );
  }

  // 파일 업로드
  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.configService.loadConfig().pipe(
      switchMap(config => 
        this.http.post<T>(`${config.apiUrl}${endpoint}`, formData)
      )
    );
  }

  // 현재 API URL 가져오기
  getCurrentApiUrl(): Observable<string> {
    return this.configService.loadConfig().pipe(
      switchMap(config => [config.apiUrl])
    );
  }
} 