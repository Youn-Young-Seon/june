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
  ) {}

  loadAppConfig() {
    // 기본 URL은 브라우저 환경을 위한 상대 경로입니다.
    let configUrl = '/app-config';

    // isPlatformServer()를 통해 서버 환경인지 확인합니다.
    if (isPlatformServer(this.platformId)) {
      const port = process.env['PORT'] || 4200;
      configUrl = `http://localhost:${port}/app-config`;
      console.log(`Server-side config request to: ${configUrl}`); // 서버 로그 확인용
    }

    return firstValueFrom(this.http.get(configUrl))
      .then(config => {
        this.appConfig = config;
      })
      .catch(err => {
        console.error('Failed to load app config', err);
        // 에러 발생 시에도 앱이 멈추지 않도록 기본값을 설정하거나 에러를 전파하지 않을 수 있습니다.
        // 이 부분은 앱의 정책에 따라 결정하세요.
      });
  }

  get apiUrl(): string {
    if (!this.appConfig) {
      // 로컬 개발 중 HMR(Hot-Module-Replacement) 시 여기서 에러가 날 수 있습니다.
      // fallback 값을 제공하여 안정성을 높일 수 있습니다.
      return 'http://localhost:3001/api'; 
    }
    return this.appConfig.apiUrl;
  }

  get wsUrl(): string {
    if (!this.appConfig) {
      return 'ws://localhost:3001';
    }
    return this.appConfig.wsUrl;
  }
} 