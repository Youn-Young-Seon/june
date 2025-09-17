import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../video.service';
import { Video } from '../types';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss'],
  imports: [CommonModule]
})
export class VideoDetailComponent implements OnInit {
  video: Video | null = null;
  loading = true;
  error: string | null = null;
  streamUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        this.videoService.getVideoById(id).subscribe((video) => {
          this.video = video;
          this.streamUrl = `${environment.apiUrl}/video/stream/${id}`;
          this.loading = false;
        });        
    }
  }
}