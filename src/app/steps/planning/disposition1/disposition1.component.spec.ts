import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disposition1Component } from './disposition1.component';

describe('Disposition1Component', () => {
  let component: Disposition1Component;
  let fixture: ComponentFixture<Disposition1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Disposition1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Disposition1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
