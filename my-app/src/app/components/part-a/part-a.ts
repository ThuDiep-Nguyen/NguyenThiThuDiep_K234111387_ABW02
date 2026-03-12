import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-part-a',
  standalone: false,
  templateUrl: './part-a.html',
  styleUrl: './part-a.css',
})
export class PartA {
   user: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
  }
}
