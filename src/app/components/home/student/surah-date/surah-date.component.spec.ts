import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurahDateComponent } from './surah-date.component';

describe('SurahDateComponent', () => {
  let component: SurahDateComponent;
  let fixture: ComponentFixture<SurahDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurahDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurahDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
