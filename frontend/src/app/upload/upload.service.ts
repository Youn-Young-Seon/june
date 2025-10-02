import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { ConfigService } from '../config/config.service';
import * as exifr from 'exifr';

export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

export interface VideoUploadData {
  title: string;
  description: string;
  files: File[];
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
    videoData.files.forEach(async (file) => {
      formData.append('file', file);

      const isVideo = file.type.startsWith('video');
      const exifData = await exifr.parse(file, { xmp: true });

      let capturedDate = null;
      if (isVideo && exifData && exifData.CreateDate) {
        capturedDate = exifData.CreateDate;
      } else if (exifData && exifData.DateTimeOriginal) {
        capturedDate = exifData.DateTimeOriginal;
      } else {
        console.warn('메타데이터에 촬영 날짜 정보가 없습니다.');
      }
      
      if (capturedDate) {
        // Date 객체를 생성하여 원하는 형식으로 변환할 수 있습니다.
        const date = new Date(capturedDate);
        formData.append('lastModified', date.getTime().toString());
      } else {
        // EXIF/XMP 데이터가 없는 경우 lastModified를 대체값으로 사용
        formData.append('lastModified', file.lastModified.toString());
      }

    });

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