import { Injectable } from '@angular/core';
import { OrderItem, Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private items: OrderItem[] = [];

  getItems() { return this.items; }

  addToOrder(product: Product, qty: number = 1) {
    const existing = this.items.find(i => i.product._id === product._id);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.items.push({ product, quantity: qty });
    }
  }

  updateQuantity(index: number, qty: number) {
    if (qty <= 0) this.items.splice(index, 1);
    else this.items[index].quantity = qty;
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  getTotal() {
    return this.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  }

  clearOrder() { this.items = []; }
}