import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Login} from './types/login';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {User} from '../auth/types/user';
// import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  id: string = "";
  password: string = "";

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  onLogin() {
    const loginInfo: Login = {id: this.id, password: this.password};

    this.http.post('http://localhost:5000/api/login', loginInfo).subscribe(result => {
      const user = result as User;
      this.authService.login(user);
      this.router.navigate(['/main']);
    });
  }
}
