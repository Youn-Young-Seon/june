import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  notifications = [
    {
      id: 1,
      title: 'New task assigned',
      message: 'You have been assigned to a new task',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'Project update',
      message: 'Project "Website Redesign" has been updated',
      time: '1 hour ago',
      read: true
    }
  ];

  unreadCount = this.notifications.filter(n => !n.read).length;
} 