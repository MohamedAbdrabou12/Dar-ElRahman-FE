import {TestBed} from '@angular/core/testing';

import {TeacherResultService} from './teacher-result.service';

describe('TeacherResultService', () => {
  let service: TeacherResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
