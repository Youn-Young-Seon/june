import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="dashboard-message">I will load videos in the future!</div>`,
  styles: [`.dashboard-message { font-size: 1.2rem; margin-top: 16px; }`]
})
export class DashboardComponent {} 