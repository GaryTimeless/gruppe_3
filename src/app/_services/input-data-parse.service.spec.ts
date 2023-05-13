import { TestBed } from '@angular/core/testing';

import { InputDataParseService } from './input-data-parse.service';

describe('InputDataParseService', () => {
  let service: InputDataParseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputDataParseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
