import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { ConfigService } from '../config/config.service';

export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

export interface VideoUploadData {
  title: string;
  description: string;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  uploadFinished$ = new Subject<void>();

  constructor(private http: HttpClient, private configService: ConfigService) {}

  uploadVideo(videoData: VideoUploadData): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('file', videoData.file);

    return this.http.post(`${this.configService.apiUrl}/upload/multiple`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / (event.total || 0));
            return {
              progress,
              loaded: event.loaded,
              total: event.total || 0
            };
          case HttpEventType.Response:
            return {
              progress: 100,
              loaded: 0,
              total: 0
            };
          default:
            return {
              progress: 0,
              loaded: 0,
              total: 0
            };
        }
      })
    );
  }

  // 파일 크기 검증
  // validateFileSize(file: File, maxSizeMB: number = 1000): boolean {
  //   const maxSizeBytes = maxSizeMB * 1024 * 1024;
  //   return file.size <= maxSizeBytes;
  // }

  // 파일 타입 검증
  validateFileType(file: File): boolean {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    return allowedTypes.includes(file.type);
  }

  notifyUploadFinished(): void {
    this.uploadFinished$.next();
  }
}  