import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterFormData, RegisterData } from '../types';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  formData: RegisterFormData = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.formData.password !== this.formData.confirmPassword) {
      console.error('login fail');
      return;
    }

    const registerData: RegisterData = {
      email: this.formData.email,
      password: this.formData.password
    };

    this.authService.register(registerData)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }
}
