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
            return localStorage.getItem(this.ACCESS_TOKEN);
        }
        return null;
    }

    removeToken() {
        localStorage.removeItem(this.ACCESS_TOKEN);
    }

    isLoggedIn() {
        return !!this.getToken();
    }
}
