import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: any = null;
  private currentRole: string = '';

  setUser(user: any, role: string) {
    this.currentUser = user;
    this.currentRole = role;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);
  }

  getUser() {
    return this.currentUser || JSON.parse(localStorage.getItem('user') || 'null');
  }

  getRole() {
    return this.currentRole || localStorage.getItem('role') || '';
  }

  isLoggedIn() {
    return !!this.getUser();
  }

  isEmployee() {
    return this.getRole() === 'employee';
  }

  logout() {
    this.currentUser = null;
    this.currentRole = '';
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }
}