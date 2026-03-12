import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Products } from './components/products/products';
import { CurrentOrder } from './components/current-order/current-order';
import { Revenue } from './components/revenue/revenue';
import { Login } from './components/login/login';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: Products },
  { path: 'order', component: CurrentOrder },
  { path: 'revenue', component: Revenue },
  { path: 'login', component: Login }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}