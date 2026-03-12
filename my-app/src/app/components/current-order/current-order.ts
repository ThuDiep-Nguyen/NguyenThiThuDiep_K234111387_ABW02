import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { OrderItem } from '../../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.html',
  styleUrls: ['./current-order.css'],
  standalone: false
})
export class CurrentOrder implements OnInit {
  items: OrderItem[] = [];

  constructor(
    public order: OrderService,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.items = this.order.getItems();
  }

  updateQty(index: number, ev: any) {
    const val = parseInt(ev.target.value, 10);
    this.order.updateQuantity(index, val);
  }

  remove(index: number) {
    this.order.removeItem(index);
  }

  get total() {
    return this.order.getTotal();
  }

  buyMore() {
    this.router.navigate(['/shopping']);
  }

  payment() {
    // Requirements: Customers must log in to complete the payment process
    if (!this.auth.isLoggedIn()) {
      alert('Please login to complete your payment process!');
      this.router.navigate(['/login']);
      return;
    }

    if (this.auth.getRole() !== 'customer') {
      alert('Only registered Customers can complete the payment process!');
      return;
    }

    if (this.items.length === 0) return alert('Order is empty!');
    const user = this.auth.getUser();

    // Create new order
    const orderId = 'ORD' + new Date().getTime();
    const order = {
      orderId,
      customerId: user.customerId || user.username,
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
      total: this.total
    };

    this.api.createOrder(order).subscribe(res => {
      // Create details
      this.items.forEach(item => {
        this.api.createOrderDetail({
          orderId,
          productId: item.product.productId,
          quantity: item.quantity,
          price: item.product.price
        }).subscribe();
      });

      alert('Payment Successful!');
      this.order.clearOrder();
      this.items = [];
    });
  }
}