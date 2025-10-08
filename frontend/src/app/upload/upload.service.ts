import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subject, from, map, switchMap } from 'rxjs';
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

  constructor(private http: HttpClient, private configService: ConfigService) { }

  uploadVideo(videoData: VideoUploadData): Observable<UploadProgress> {
    const processingPromise = this.processFilesAndCreateFormData(videoData);

    return from(processingPromise).pipe(
      switchMap(formData => {
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
      })
    )
  };

  private async processFilesAndCreateFormData(videoData: VideoUploadData): Promise<FormData> {
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);

    // forEach 대신 for...of 루프 사용
    for (const file of videoData.files) {
      if (!file || file.size === 0) {
        console.warn('Skipping empty or invalid file:', file.name);
        continue;
      }

      formData.append('file', file);

      const isVideo = file.type.startsWith('video');

      let capturedDate = null;
      try {
        const exifData = await exifr.parse(file, { xmp: true });
        if (isVideo && exifData && exifData.CreateDate) {
          capturedDate = exifData.CreateDate;
        } else if (exifData && exifData.DateTimeOriginal) {
          capturedDate = exifData.DateTimeOriginal;
        }
      } catch (e) {
        console.error('EXIF/XMP 파싱 실패:', e);
      }

      if (capturedDate) {
        const date = new Date(capturedDate);
        formData.append('lastModified', date.getTime().toString());
      } else {
        // EXIF/XMP 데이터가 없는 경우 lastModified를 대체값으로 사용
        formData.append('lastModified', file.lastModified.toString());
      }
    }

    return formData; // 모든 처리가 끝난 후 formData 객체를 반환합니다.
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