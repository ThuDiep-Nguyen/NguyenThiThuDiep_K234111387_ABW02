import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Products
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/categories`);
  }
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/products`);
  }
  searchProducts(params: any): Observable<any[]> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any[]>(`${this.base}/search/products`, { params: httpParams });
  }

  // Auth
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/login`, { username, password });
  }

  // Orders
  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.base}/orders`, order);
  }
  createOrderDetail(detail: any): Observable<any> {
    return this.http.post(`${this.base}/orderdetails`, detail);
  }
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/orders`);
  }
  updateOrder(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/orders/${id}`, data);
  }
  getRevenue(): Observable<any> {
    return this.http.get(`${this.base}/revenue`);
  }
}