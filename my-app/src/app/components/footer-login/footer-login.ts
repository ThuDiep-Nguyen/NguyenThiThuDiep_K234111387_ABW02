import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-login',
  templateUrl: './footer-login.html',
  styleUrls: ['./footer-login.css'],
  standalone: false
})
export class FooterLogin {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
