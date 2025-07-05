import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface AppConfig {
  apiUrl: string;
  production: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig | null = null;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<AppConfig> {
    if (this.config) {
      return of(this.config);
    }

    // 먼저 런타임 config 파일 시도
    return this.http.get<AppConfig>('/assets/config/config.json').pipe(
      map(config => {
        this.config = config;
        return config;
      }),
      catchError(() => {
        // config 파일이 없으면 자동 감지
        return this.autoDetectConfig();
      })
    );
  }

  private autoDetectConfig(): Observable<AppConfig> {
    // 브라우저 URL 기반으로 백엔드 URL 자동 감지
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // Docker 환경에서 일반적인 백엔드 포트들 시도
    const possiblePorts = [3000, 8080, 8000, 5000];
    
    return this.detectAvailableBackend(protocol, hostname, possiblePorts).pipe(
      map(apiUrl => {
        this.config = {
          apiUrl: `${apiUrl}/api`,
          production: false
        };
        return this.config;
      }),
      catchError(() => {
        // 모든 감지 실패 시 기본값 사용
        this.config = {
          apiUrl: 'http://localhost:3000/api',
          production: false
        };
        return of(this.config);
      })
    );
  }

  private detectAvailableBackend(protocol: string, hostname: string, ports: number[]): Observable<string> {
    return new Observable(observer => {
      const tryPort = (index: number) => {
        if (index >= ports.length) {
          observer.error('No available backend found');
          return;
        }

        const port = ports[index];
        const url = `${protocol}//${hostname}:${port}`;
        
        // 백엔드 health check
        this.http.get(`${url}/api/health`, { 
          responseType: 'json',
        }).subscribe({
          next: () => {
            observer.next(url);
            observer.complete();
          },
          error: () => {
            // 다음 포트 시도
            tryPort(index + 1);
          }
        });
      };

      tryPort(0);
    });
  }

  getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Config not loaded. Call loadConfig() first.');
    }
    return this.config;
  }

  getApiUrl(): string {
    return this.getConfig().apiUrl;
  }
} 