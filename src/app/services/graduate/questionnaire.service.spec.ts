import { TestBed } from '@angular/core/testing';

import { GraduateService } from './graduate.service';

describe('GraduateService', () => {
  let service: GraduateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraduateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
