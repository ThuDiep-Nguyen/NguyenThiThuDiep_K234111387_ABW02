import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { Product } from '../../models/models';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: false
})
export class Products implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  categories: any[] = [];
  groupedData: { category: any, products: Product[] }[] = [];
  
  // Search and Sort parameters
  minPrice: number | null = null;
  maxPrice: number | null = null;
  priceRange: string = '';
  priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under 200,000', value: 'under200' },
    { label: '200,000 - 400,000', value: '200to400' },
    { label: '400,000 - 600,000', value: '400to600' },
    { label: 'Above 600,000', value: 'above600' }
  ];
  model: string = '';
  madeBy: string = '';
  sortBy: string = '';

  modelOptions: string[] = [];
  madeByOptions: string[] = [];

  constructor(
    private api: ApiService,
    private order: OrderService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    forkJoin({
      cats: this.api.getCategories(),
      prods: this.api.getProducts()
    }).subscribe(res => {
      this.categories = res.cats;
      this.products = res.prods;
      this.allProducts = res.prods;
      this.applySort(this.products);
      this.groupProducts();
      this.updateDropdownOptions();
    });
  }

  updateDropdownOptions() {
    const models = new Set<string>();
    const madeBys = new Set<string>();
    this.allProducts.forEach(p => {
      if (p.model) models.add(p.model);
      if (p.madeBy) madeBys.add(p.madeBy);
    });
    this.modelOptions = Array.from(models).sort();
    this.madeByOptions = Array.from(madeBys).sort();
  }

  search() {
    const params: any = {};
    switch (this.priceRange) {
      case 'under200':
        params.maxPrice = 200000;
        break;
      case '200to400':
        params.minPrice = 200000;
        params.maxPrice = 400000;
        break;
      case '400to600':
        params.minPrice = 400000;
        params.maxPrice = 600000;
        break;
      case 'above600':
        params.minPrice = 600000;
        break;
    }
    if (this.model.trim()) params.model = this.model;
    if (this.madeBy.trim()) params.madeBy = this.madeBy;

    this.api.searchProducts(params).subscribe(data => {
      this.products = data;
      this.applySort(this.products);
      this.groupProducts();
    });
  }

  applySort(prods: Product[]) {
    if (this.sortBy === 'asc') {
      prods.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'desc') {
      prods.sort((a, b) => b.price - a.price);
    }
  }

  reset() {
    this.minPrice = null;
    this.maxPrice = null;
    this.priceRange = '';
    this.model = '';
    this.madeBy = '';
    this.sortBy = '';
    this.loadInitialData();
  }

  groupProducts() {
    this.groupedData = this.categories.map(cat => ({
      category: cat,
      products: this.products.filter(p => p.categoryId === cat.categoryId)
    })).filter(group => group.products.length > 0);
  }

  addToCart(product: Product, qtyStr: string) {
    if (!this.auth.isLoggedIn() || this.auth.getRole() !== 'customer') {
      alert('You must be logged in as a customer to add to cart!');
      this.router.navigate(['/login']);
      return;
    }
    const qty = parseInt(qtyStr, 10);
    if (qty > 0) {
      this.order.addToOrder(product, qty);
      alert(`Successfully added ${qty} item(s) of ${product.name} to order!`);
    } else {
      alert('Please enter a valid quantity!');
    }
  }

  buy(product: Product, qtyStr: string) {
    if (!this.auth.isLoggedIn() || this.auth.getRole() !== 'customer') {
      alert('You must be logged in as a customer to buy!');
      this.router.navigate(['/login']);
      return;
    }
    const qty = parseInt(qtyStr, 10);
    if (qty > 0) {
      this.order.addToOrder(product, qty);
      this.router.navigate(['/order']);
    }
  }

  clearPriceRange() {
    this.priceRange = '';
  }
  clearModel() {
    this.model = '';
  }
  clearMadeBy() {
    this.madeBy = '';
  }
}
