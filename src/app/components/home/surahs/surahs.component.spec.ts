import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurahsComponent } from './surahs.component';

describe('SurahsComponent', () => {
  let component: SurahsComponent;
  let fixture: ComponentFixture<SurahsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurahsComponent]
    });
    fixture = TestBed.createComponent(SurahsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
