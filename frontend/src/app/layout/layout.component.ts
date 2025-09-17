import { Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { VideoComponent } from '../video/video.component';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, SidebarComponent, VideoComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
