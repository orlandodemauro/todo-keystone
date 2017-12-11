import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { TodoComponent } from './todo/todo.component';
import { LoginComponent } from './login/login.component';
import { LoggedInGuard } from './logged-in.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: ':status', component: TodoComponent, canActivate: [LoggedInGuard] },
  { path: '**', redirectTo: '/login' }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
