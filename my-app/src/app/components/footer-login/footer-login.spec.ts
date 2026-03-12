import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLogin } from './footer-login';

describe('FooterLogin', () => {
  let component: FooterLogin;
  let fixture: ComponentFixture<FooterLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
