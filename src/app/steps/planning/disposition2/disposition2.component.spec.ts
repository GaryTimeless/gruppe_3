import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disposition2Component } from './disposition2.component';

describe('Disposition2Component', () => {
  let component: Disposition2Component;
  let fixture: ComponentFixture<Disposition2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Disposition2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Disposition2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
