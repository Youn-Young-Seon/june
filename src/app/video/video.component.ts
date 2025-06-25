import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from './video.service';
import { Video } from './types';
import { UploadService } from '../upload/upload.service';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  videos: Video[] = [];
  loading = false;
  error: string | null = null;

  // 모달 재생용
  selectedVideo: Video | null = null;
  showModal = false;

  hoveredVideoId: string | null = null;

  constructor(
    private videoService: VideoService,
    private uploadService: UploadService,
  ) {}

  ngOnInit(): void {
    this.loadVideos();

    this.uploadService.uploadFinished$.subscribe(() => {
      this.loadVideos();
    });
  }

  loadVideos(): void {
    this.loading = true;
    this.error = null;
    this.videoService.getVideos().subscribe({
      next: (videos) => {
        this.videos = videos;
        console.log(this.videos);
        this.loading = false;
      },
      error: () => {
        this.error = '비디오 목록을 불러오지 못했습니다.';
        this.loading = false;
      }
    });
  }

  openModal(video: Video): void {
    this.selectedVideo = video;
    this.showModal = true;
    this.hoveredVideoId = null;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedVideo = null;
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
  }

  onMouseLeave(videoId: string): void {
    if (this.hoveredVideoId === videoId) {
      this.hoveredVideoId = null;
    }
  }
}
