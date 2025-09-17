import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    
    return next(req).pipe(
        catchError((error) => {
            // 401 Unauthorized 에러가 발생하면 토큰을 제거
            if (error.status === 401) {
                authService.removeToken();
                // 로그인 페이지로 리다이렉트하거나 다른 처리를 할 수 있습니다
                console.log('Token expired, redirecting to login...');
            }
            return throwError(() => error);
        })
    );
};