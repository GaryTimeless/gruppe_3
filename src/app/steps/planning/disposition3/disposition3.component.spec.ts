import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disposition3Component } from './disposition3.component';

describe('Disposition3Component', () => {
  let component: Disposition3Component;
  let fixture: ComponentFixture<Disposition3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Disposition3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Disposition3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
