import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { LoginData, RegisterData } from "./types";
import { environment } from "../../environments/environment";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly ACCESS_TOKEN = 'access_token';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID)
        private platformId: Object
    ) {}

    signIn(loginData: LoginData) {
        return this.http.post(`${environment.apiUrl}/login`, loginData);
    }

    register(registerData: RegisterData) {
        return this.http.post(`${environment.apiUrl}/user`, registerData);
    }

    setToken(token: string) {
        localStorage.setItem(this.ACCESS_TOKEN, token);
    }

    getToken() {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem(this.ACCESS_TOKEN);
            if (token && this.isTokenExpired(token)) {
                this.removeToken();
                return null;
            }
            return token;
        }
        return null;
    }

    removeToken() {
        localStorage.removeItem(this.ACCESS_TOKEN);
    }

    isLoggedIn() {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem(this.ACCESS_TOKEN);
            if (token && this.isTokenExpired(token)) {
                this.removeToken();
                return false;
            }
            return !!token;
        }
        return false;
    }

    // JWT 토큰의 만료 시간을 확인하는 메서드
    isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            // 토큰 파싱에 실패하면 만료된 것으로 간주
            return true;
        }
    }

    // 토큰의 만료 시간을 반환하는 메서드
    getTokenExpirationTime(token: string): Date | null {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return new Date(payload.exp * 1000);
        } catch (error) {
            return null;
        }
    }

    // 토큰이 곧 만료될 예정인지 확인 (기본값: 5분 전)
    isTokenExpiringSoon(token: string, minutesBefore: number = 5): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            const timeUntilExpiry = payload.exp - currentTime;
            return timeUntilExpiry < (minutesBefore * 60);
        } catch (error) {
            return true;
        }
    }
}
