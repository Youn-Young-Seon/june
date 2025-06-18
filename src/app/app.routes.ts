import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'navbar', loadComponent: () => import('./layout/navbar/navbar.component').then(m => m.NavbarComponent) },
            { path: 'sidebar', loadComponent: () => import('./layout/sidebar/sidebar.component').then(m => m.SidebarComponent) }
        ]
    },
    {
        path: 'register',
        component: RegisterComponent,
    }
];
