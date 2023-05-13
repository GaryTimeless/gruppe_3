import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelldirectComponent } from './selldirect.component';

describe('SelldirectComponent', () => {
  let component: SelldirectComponent;
  let fixture: ComponentFixture<SelldirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelldirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelldirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
