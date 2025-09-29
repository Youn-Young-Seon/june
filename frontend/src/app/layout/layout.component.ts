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
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }
}
