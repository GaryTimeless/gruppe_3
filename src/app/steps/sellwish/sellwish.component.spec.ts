import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellwishComponent } from './sellwish.component';

describe('SellwishComponent', () => {
  let component: SellwishComponent;
  let fixture: ComponentFixture<SellwishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellwishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellwishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
