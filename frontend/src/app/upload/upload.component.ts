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
          this.selectedFiles.push(file);
          this.uploadProgress[file.name] = { progress: 0 };
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
    const allUploads = this.selectedFiles.map(file => {
      const uploadData: VideoUploadData = {
        title: file.name, // Use filename as title
        description: '', // Empty description
        files: [file]
      };

      return this.uploadService.uploadVideo(uploadData).pipe(
        tap(event => {
          if (event) {
            this.uploadProgress[file.name] = { progress: event.progress };
          }
        }),
        catchError(error => {
          console.error(`Upload failed for ${file.name}:`, error);
          this.uploadProgress[file.name] = { progress: -1 }; // Indicate failure
          return of(null); // Continue with other uploads
        })
      );
    });

    forkJoin(allUploads).subscribe({
      // 'next' is called when all observables complete.
      // Individual results are in the 'results' array.
      next: (results) => {
        const successfulUploads = results.filter(r => r !== null).length;
        alert(`${successfulUploads} out of ${this.selectedFiles.length} files uploaded successfully.`);
      },
      error: (error) => {
        // This is for unexpected errors in forkJoin itself.
        console.error('An unexpected error occurred during the upload process:', error);
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