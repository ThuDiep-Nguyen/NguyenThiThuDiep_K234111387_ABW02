import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false
})
export class Login {
  username = '';
  password = '';
  error = '';
  success = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.api.login(this.username, this.password).subscribe(res => {
      if (res.success) {
        this.auth.setUser(res.user, res.role);
        this.success = 'Đăng nhập thành công!';
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 700);
      } else {
        this.error = res.message || 'Invalid credentials';
        this.success = '';
      }
    }, err => {
      this.error = 'Server error';
      this.success = '';
    });
  }
}
