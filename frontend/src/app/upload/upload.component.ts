import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadService, VideoUploadData } from './upload.service';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  @Output() closeModal = new EventEmitter<void>();

  selectedFiles: File[] = [];
  isUploading = false;
  uploadProgress: { [key: string]: { progress: number } } = {};

  constructor(private uploadService: UploadService) { }

  close() {
    this.closeModal.emit();
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.uploadService.validateFileType(file)) {
          if (!this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
            this.selectedFiles.push(file);
            this.uploadProgress[file.name] = { progress: 0 };
          }
        } else {
          alert(`Invalid file type: ${file.name}. Please select valid video or image files.`);
        }
      }
    }
  }

  onSubmit() {
    if (this.selectedFiles.length === 0) {
      alert('Please select one or more files to upload.');
      return;
    }

    this.isUploading = true;

    const uploadData: VideoUploadData = {
      title: 'My Video Upload', // 전체 업로드 대표 제목 등
      description: '',
      files: this.selectedFiles,
    };

    this.uploadService.uploadVideo(uploadData).subscribe({
      next: (event) => {
        if (event) {
          // progress 이벤트 처리
          // 필요시 파일별 progress는 따로 관리 가능
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.isUploading = false;
      },
      complete: () => {
        this.isUploading = false;
        this.uploadService.notifyUploadFinished();
        this.close();
      },
    });
  }
} 