import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {LoginRedirectGuard} from './auth/guard/login-redirect-guard';
import {AuthGuard} from './auth/guard/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginRedirectGuard],
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
];
