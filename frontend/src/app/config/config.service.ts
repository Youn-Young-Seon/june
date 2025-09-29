import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl: string;
  production: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private appConfig: any;

  // PLATFORM_ID를 주입받아 현재 실행 환경을 감지합니다.
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  loadAppConfig(): Promise<any> {
    if (isPlatformServer(this.platformId)) {
      // --- 서버 환경일 경우 ---
      // HTTP 요청 대신 process.env에서 직접 값을 읽습니다.
      // 이렇게 하면 레이스 컨디션 문제가 발생하지 않습니다.
      this.appConfig = {
        apiUrl: process.env['API_URL'] || process.env['LOCAL_API_URL'] || 'http://localhost:5000/api', // k8s 환경변수가 없으면 fallback
        wsUrl: process.env['WS_URL'] || 'ws://localhost:5000',
      };

      return Promise.resolve(); // 설정이 완료되었음을 즉시 알립니다.
    } else {
      // --- 브라우저 환경일 경우 ---
      // 기존과 동일하게 /app-config 엔드포인트를 호출합니다.
      console.log('Loading config on BROWSER by fetching /app-config');
      return firstValueFrom(this.http.get('/app-config'))
        .then(config => {
          this.appConfig = config;
        })
        .catch(err => {
          console.error('Failed to load app config on browser', err);
        });
    }
  }

  get apiUrl(): string {
    if (this.appConfig) {
      return this.appConfig.apiUrl;
    }
    return 'http://localhost:5000/api';
  }

  get wsUrl(): string {
    if (this.appConfig) {
      return this.appConfig.wsUrl;
    }
    return 'ws://localhost:5000';
  }
} 