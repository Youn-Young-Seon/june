import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from './types';
import { AuthService } from '../../auth/auth.service';

@Component({  
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() 
  collapsed = false;

  @Input() isMobileOpen!: boolean;

  commonMenuItems: MenuItem[] = [
    {
      name: 'Home',
      link: '/',
      d: 'M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2V7a2 2 0 00-2-2h-3.5'
    },
    {
      name: 'Subscriptions',
      link: '/subscriptions',
      d: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z'
    },
    {
      name: 'Trending',
      link: '/trending',
      d: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
  ]

  personalMenuItems: MenuItem[] = [    
    {
      name: 'History',
      link: '/history',
      d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'  
    },
    {
      name: 'Liked videos',
      link: '/liked',
      d: 'M5 15l7-7 7 7'
    },
    {
      name: 'All playlists',
      link: '/playlists',
      d: 'M4 6h16M4 10h16M4 14h16M4 18h16'
    }  
  ]

  constructor(
    private authService: AuthService
  ){}

  checkIsLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
