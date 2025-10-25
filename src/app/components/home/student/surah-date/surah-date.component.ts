import {Component, input} from '@angular/core';
import {Surah} from "../../../../models/Surah.model";
import {Grade} from "../../../../models/enums/Grade.enum";

@Component({
  selector: 'app-surah-date',
  imports: [],
  templateUrl: './surah-date.component.html',
  styleUrl: './surah-date.component.scss'
})
export class SurahDateComponent {
  surah = input.required<Surah | undefined>();
  successDate = input<Date>(); // if API returns string, keep as union
  grade = input<Grade>();

  private gradeMap: { [key: string]: string } = {
    [Grade.excellent]: 'ممتاز',
    [Grade.very_good]: 'جيد جدا',
    [Grade.good]: 'جيد'
  };

  getArabicGrade(grade: string | null | undefined): string {
    if (!grade)
      return '';
    return this.gradeMap[grade] || grade;
  }
}

