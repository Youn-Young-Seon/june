import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginData, RegisterData } from "./types";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    signIn(loginData: LoginData) {
        return this.http.post(`${environment.apiUrl}/login`, loginData);
    }

    register(registerData: RegisterData) {
        return this.http.post(`${environment.apiUrl}/user`, registerData);
    }
}
