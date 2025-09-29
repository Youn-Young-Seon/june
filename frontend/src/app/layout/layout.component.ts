import { Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { VideoComponent } from '../video/video.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, VideoComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  // Set to false to ensure sidebar is always expanded when shown on desktop.
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;

  toggleSidebar() {
    // This button should only toggle the mobile sidebar overlay.
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }
}
