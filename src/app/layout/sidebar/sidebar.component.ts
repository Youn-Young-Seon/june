import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({  
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() collapsed = false;
}
