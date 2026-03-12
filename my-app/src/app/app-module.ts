import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { App } from './app';
import { Header } from './components/header/header';
import { PartA } from './components/part-a/part-a';
import { Products } from './components/products/products';
import { CurrentOrder } from './components/current-order/current-order';
import { Revenue } from './components/revenue/revenue';
import { Login } from './components/login/login';

import { FooterLogin } from './components/footer-login/footer-login';
import { AppRoutingModule } from './app-routing-module';


@NgModule({
  declarations: [
    App,
    Header,
    PartA,
    Products,
    CurrentOrder,
    Revenue,
    Login,
    FooterLogin
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  bootstrap: [App]
})
export class AppModule {}