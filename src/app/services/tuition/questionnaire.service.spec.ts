import { TestBed } from '@angular/core/testing';

import { TuitionService } from './tuition.service';

describe('GraduateService', () => {
  let service: TuitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TuitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
