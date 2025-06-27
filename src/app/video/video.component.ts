import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from './video.service';
import { Video } from './types';
import { UploadService } from '../upload/upload.service';
import { environment } from '../../environments/environment';
import { debounceTime, Subject } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  videos: Video[] = [];
  loading = false;
  error: string | null = null;

  selectedVideo: Video | null = null;
  showModal = false;

  hoveredVideoId: string | null = null;
  videoStreamUrl: string | null = null;

  hoverVideoSubject$ = new Subject<string | null>();

  constructor(
    private videoService: VideoService,
    private uploadService: UploadService,
  ) {}

  ngOnInit(): void {
    this.loadVideos();

    this.uploadService.uploadFinished$.subscribe(() => {
      this.loadVideos();
    });

    this.hoverVideoSubject$
      .pipe(debounceTime(250))
      .subscribe((videoId) => {
        if (videoId) {
          this.videoStreamUrl = `${environment.apiUrl}/video/stream/${videoId}`;
        } else {
          this.videoStreamUrl = null;
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.hoverVideoSubject$.unsubscribe();
  }

  loadVideos(): void {
    this.loading = true;
    this.error = null;
    this.videoService.getVideos().subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;
      },
      error: () => {
        this.error = '비디오 목록을 불러오지 못했습니다.';
        this.loading = false;
      }
    });
  }

  formatViews(views: number): string {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
    return date.toLocaleDateString('ko-KR');
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) target.src = '/assets/default-thumbnail.svg';
  }

  onMouseEnter(videoId: string): void {
    this.hoveredVideoId = videoId;
    this.hoverVideoSubject$.next(videoId);
  }

  onMouseLeave(): void {
    this.hoveredVideoId = null;
    this.videoStreamUrl = null;
  }
}
