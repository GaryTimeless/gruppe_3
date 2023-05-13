import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFileUploadComponent } from './ui-file-upload.component';

describe('UiFileUploadComponent', () => {
  let component: UiFileUploadComponent;
  let fixture: ComponentFixture<UiFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
