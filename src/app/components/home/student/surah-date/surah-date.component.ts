import {Component, computed, input} from '@angular/core';
import {NgClass} from '@angular/common';
import {Surah} from "../../../../models/Surah.model";
import {Grade} from "../../../../models/enums/Grade.enum";

@Component({
  selector: 'app-surah-date',
  imports: [NgClass],
  templateUrl: './surah-date.component.html',
  styleUrl: './surah-date.component.scss'
})
export class SurahDateComponent {
  surah = input.required<Surah | undefined>();
  successDate = input<Date>();
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

  gradeColorClass = computed(() => {
    switch (this.grade()) {
      case Grade.excellent: return 'bg-emerald-500';
      case Grade.very_good: return 'bg-blue-500';
      case Grade.good: return 'bg-amber-500';
      default: return 'bg-gray-300';
    }
  });

  gradeIconBgClass = computed(() => {
    switch (this.grade()) {
      case Grade.excellent: return 'bg-emerald-100 dark:bg-emerald-900/30';
      case Grade.very_good: return 'bg-blue-100 dark:bg-blue-900/30';
      case Grade.good: return 'bg-amber-100 dark:bg-amber-900/30';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  });

  gradeIconTextClass = computed(() => {
    switch (this.grade()) {
      case Grade.excellent: return 'text-emerald-600 dark:text-emerald-400';
      case Grade.very_good: return 'text-blue-600 dark:text-blue-400';
      case Grade.good: return 'text-amber-600 dark:text-amber-400';
      default: return 'text-gray-500';
    }
  });

  gradeBadgeClass = computed(() => {
    switch (this.grade()) {
      case Grade.excellent: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case Grade.very_good: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case Grade.good: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  });
}

