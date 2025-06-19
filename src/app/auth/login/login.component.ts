import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginData } from '../types';

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

  loginData: LoginData = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  close() {
    this.closeModal.emit();
  }

  openRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    this.authService.signIn(this.loginData)
      .subscribe({
        next: (response) => {
          console.log(response);
          const accessToken: string = Object.getOwnPropertyDescriptor(response, 'access_token')?.value;
          this.authService.setToken(accessToken);
          this.close();

        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}
