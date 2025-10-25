import { TestBed } from '@angular/core/testing';

import { SurahsService } from './surahs.service';

describe('SurahsService', () => {
  let service: SurahsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurahsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
