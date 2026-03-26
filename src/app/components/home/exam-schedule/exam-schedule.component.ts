import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ExamSchedule} from 'src/app/models/ExamSchedule.model';
import {ExamStatus} from 'src/app/models/enums/ExamStatus.enum';
import {ExamScheduleService} from 'src/app/services/exam-schedule/exam-schedule.service';

@Component({
  selector: 'app-exam-schedule',
  templateUrl: './exam-schedule.component.html',
  styleUrls: ['./exam-schedule.component.scss'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class ExamScheduleComponent implements OnInit {
  schedules: ExamSchedule[] = [];
  selectedDate: string = '';
  error: string | null = null;
  success: string | null = null;
  loading = false;

  protected readonly ExamStatus = ExamStatus;

  // Group schedules by ring name
  groupedSchedules: Map<string, ExamSchedule[]> = new Map();

  constructor(
    private examScheduleService: ExamScheduleService,
  ) {
  }

  ngOnInit(): void {
    this.selectedDate = this.getTodayDate();
    this.loadSchedules();
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  loadSchedules(): void {
    this.loading = true;
    this.error = null;
    this.examScheduleService.getScheduleByDate(this.selectedDate).subscribe({
      next: (response: any) => {
        this.schedules = response.data || [];
        this.groupSchedulesByRing();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'حدث خطأ أثناء تحميل جدول الاختبارات';
        this.loading = false;
        console.error('Failed to load schedules', err);
      }
    });
  }

  onDateChange(): void {
    this.loadSchedules();
  }

  groupSchedulesByRing(): void {
    this.groupedSchedules = new Map();
    for (const schedule of this.schedules) {
      const ringName = schedule.questionnaire?.ring?.name || 'غير محدد';
      if (!this.groupedSchedules.has(ringName)) {
        this.groupedSchedules.set(ringName, []);
      }
      this.groupedSchedules.get(ringName)!.push(schedule);
    }
  }

  getGroupedKeys(): string[] {
    return Array.from(this.groupedSchedules.keys());
  }

  markAsExamined(scheduleId: number): void {
    if (!confirm('هل تم اختبار هذا الطالب؟')) return;
    this.examScheduleService.updateExamStatus(scheduleId, ExamStatus.EXAMINED).subscribe({
      next: () => {
        this.success = 'تم تحديث حالة الاختبار';
        this.loadSchedules();
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = err?.error?.message || 'حدث خطأ أثناء تحديث الحالة';
      }
    });
  }

  cancelSchedule(scheduleId: number): void {
    if (!confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) return;
    this.examScheduleService.cancelExamSchedule(scheduleId).subscribe({
      next: () => {
        this.loadSchedules();
      },
      error: (err) => {
        this.error = err?.error?.message || 'حدث خطأ أثناء إلغاء الموعد';
      }
    });
  }

  getStatusLabel(status: string | undefined): string {
    switch (status) {
      case ExamStatus.PENDING: return 'قيد الانتظار';
      case ExamStatus.EXAMINED: return 'تم الاختبار';
      case ExamStatus.CANCELLED: return 'ملغى';
      default: return status || '';
    }
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case ExamStatus.PENDING: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case ExamStatus.EXAMINED: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case ExamStatus.CANCELLED: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return '';
    }
  }

  getPendingCount(): number {
    return this.schedules.filter(s => s.status === ExamStatus.PENDING).length;
  }

  getExaminedCount(): number {
    return this.schedules.filter(s => s.status === ExamStatus.EXAMINED).length;
  }

  getCancelledCount(): number {
    return this.schedules.filter(s => s.status === ExamStatus.CANCELLED).length;
  }

  goToPreviousDay(): void {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() - 1);
    this.selectedDate = date.toISOString().split('T')[0];
    this.loadSchedules();
  }

  goToNextDay(): void {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() + 1);
    this.selectedDate = date.toISOString().split('T')[0];
    this.loadSchedules();
  }

  goToToday(): void {
    this.selectedDate = this.getTodayDate();
    this.loadSchedules();
  }

  isToday(): boolean {
    return this.selectedDate === this.getTodayDate();
  }
}
