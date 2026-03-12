import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartA } from './part-a';

describe('PartA', () => {
  let component: PartA;
  let fixture: ComponentFixture<PartA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartA],
    }).compileComponents();

    fixture = TestBed.createComponent(PartA);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
