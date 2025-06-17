import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() 
  closeModal = new EventEmitter<void>();

  loginData = {
    email: '',
    password: ''
  };

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    // TODO: Implement actual login logic
    console.log('Login attempt:', this.loginData);
    // After successful login
    this.close();
  }
}
