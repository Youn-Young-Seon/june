import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuItems = [
    { path: '/dashboard', label: '대시보드', icon: 'dashboard' },
    { path: '/projects', label: '프로젝트', icon: 'folder' },
    { path: '/tasks', label: '작업', icon: 'checklist' },
    { path: '/calendar', label: '캘린더', icon: 'calendar' },
    { path: '/team', label: '팀', icon: 'group' },
    { path: '/settings', label: '설정', icon: 'settings' }
  ];
} 