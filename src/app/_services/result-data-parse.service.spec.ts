import { TestBed } from '@angular/core/testing';

import { ResultDataParseService } from './result-data-parse.service';

describe('ResultDataParseService', () => {
  let service: ResultDataParseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultDataParseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
