import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadService, VideoUploadData } from './upload.service';
import { VideoData } from './types';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  @Output() closeModal = new EventEmitter<void>();

  videoData: VideoData = {
    title: '',
    description: '',
    file: null
  };

  isUploading = false;
  uploadProgress = 0;

  constructor(private uploadService: UploadService) {}

  close() {
    this.closeModal.emit();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!this.uploadService.validateFileType(file)) {
        alert('Please select a valid video file (MP4, WebM, OGG, AVI, MOV)');
        return;
      }
      
      if (!this.uploadService.validateFileSize(file)) {
        alert('File size must be less than 1GB');
        return;
      }
      
      this.videoData.file = file;
    }
  }

  onSubmit() {
    if (!this.videoData.file || !this.videoData.title.trim()) {
      alert('Please fill in all required fields and select a video file');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    const uploadData: VideoUploadData = {
      title: this.videoData.title,
      description: this.videoData.description,
      file: this.videoData.file
    };

    this.uploadService.uploadVideo(uploadData).subscribe({
      next: (progress) => {
        this.uploadProgress = progress.progress;
      },
      error: (error) => {
        console.error('Upload failed:', error);
        alert('Upload failed. Please try again.');
        this.isUploading = false;
      },
      complete: () => {
        this.isUploading = false;
        this.uploadService.notifyUploadFinished();
        this.close();
      }
    });
  }
} 