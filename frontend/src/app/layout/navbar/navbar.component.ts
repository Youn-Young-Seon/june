import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../../auth/login/login.component';
import { UploadComponent } from '../../upload/upload.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LoginComponent, UploadComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  showLoginModal = false;
  showUploadModal = false;

  constructor(private authService: AuthService) {}

  checkIsLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
  }

  logout() {
    this.authService.removeToken();
    // Optionally redirect to home page
  }
}
