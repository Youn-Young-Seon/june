import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  async register(email: string, password: string): Promise<void> {
    const response = await this.http.post(`${environment.apiUrl}/user`, {
      email,
      password
    }).toPromise();

    if (!response) {
      throw new Error('회원가입 중 오류가 발생했습니다.');
    }
  }

  async login(email: string, password: string): Promise<void> {
    const response = await this.http.post(`${environment.apiUrl}/auth/login`, {
      email,
      password
    }).toPromise();

    if (!response) {
      throw new Error('로그인 중 오류가 발생했습니다.');
    }
  }
} 