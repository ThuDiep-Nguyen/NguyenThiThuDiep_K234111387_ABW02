import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.html',
  styleUrls: ['./revenue.css'],
  standalone: false
})
export class Revenue implements OnInit {
  revenueData: any;

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    if (this.auth.isEmployee()) {
      this.api.getRevenue().subscribe(data => this.revenueData = data);
    }
  }
}
