import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ring} from 'src/app/models/Ring.model';
import {Questionnaire} from 'src/app/models/Questionnaire.model';
import {Student} from 'src/app/models/Student.model';
import {ExamSchedule, StudentExamAssignment} from 'src/app/models/ExamSchedule.model';
import {ExamStatus} from 'src/app/models/enums/ExamStatus.enum';
import {RingService} from 'src/app/services/ring/ring.service';
import {QuestionnaireService} from 'src/app/services/questionnaire/questionnaire.service';
import {StudentService} from 'src/app/services/student/student.service';
import {ExamScheduleService} from 'src/app/services/exam-schedule/exam-schedule.service';
import {AlertService} from 'src/app/services/alert.service';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-exam-distribution',
  templateUrl: './exam-distribution.component.html',
  styleUrls: ['./exam-distribution.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class ExamDistributionComponent implements OnInit {
  rings: Ring[] = [];
  questionnaires: Questionnaire[] = [];
  availableStudents: Student[] = [];
  existingSchedules: ExamSchedule[] = [];

  selectedRingId: number | null = null;
  selectedQuestionnaireId: number | null = null;

  // Assignment map: studentId -> scheduledDate
  assignments: Map<number, string> = new Map();
  // Track selected students
  selectedStudentIds: Set<number> = new Set();

  error: string | null = null;
  success: string | null = null;
  loading = false;

  protected readonly ExamStatus = ExamStatus;

  constructor(
    private ringService: RingService,
    private questionnaireService: QuestionnaireService,
    private studentService: StudentService,
    private examScheduleService: ExamScheduleService,
    private alertService: AlertService,
    protected authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.loadRings();
  }

  loadRings(): void {
    this.ringService.getAllRings(0, 100).subscribe({
      next: (response: any) => {
        this.rings = response.data || [];
      },
      error: (err) => console.error('Failed to load rings', err)
    });
  }

  onRingChange(): void {
    this.questionnaires = [];
    this.availableStudents = [];
    this.existingSchedules = [];
    this.selectedQuestionnaireId = null;
    this.assignments.clear();
    this.selectedStudentIds.clear();
    this.error = null;
    this.success = null;

    if (this.selectedRingId) {
      this.questionnaireService.getQuestionnairesByRingId(this.selectedRingId).subscribe({
        next: (response: any) => {
          this.questionnaires = (response.data || []).filter((q: Questionnaire) => !q.done);
        },
        error: (err) => console.error('Failed to load questionnaires', err)
      });
    }
  }

  onQuestionnaireChange(): void {
    this.availableStudents = [];
    this.existingSchedules = [];
    this.assignments.clear();
    this.selectedStudentIds.clear();
    this.error = null;
    this.success = null;

    if (this.selectedQuestionnaireId) {
      this.studentService.getStudentsNotInQuestionnaire(this.selectedQuestionnaireId).subscribe({
        next: (response: any) => {
          this.availableStudents = response.data || [];
        },
        error: (err) => console.error('Failed to load students', err)
      });

      this.examScheduleService.getScheduleByQuestionnaire(this.selectedQuestionnaireId).subscribe({
        next: (response: any) => {
          this.existingSchedules = response.data || [];
        },
        error: (err) => console.error('Failed to load existing schedules', err)
      });
    }
  }

  toggleStudent(studentId: number): void {
    if (this.selectedStudentIds.has(studentId)) {
      this.selectedStudentIds.delete(studentId);
      this.assignments.delete(studentId);
    } else {
      this.selectedStudentIds.add(studentId);
    }
  }

  isStudentSelected(studentId: number): boolean {
    return this.selectedStudentIds.has(studentId);
  }

  setDate(studentId: number, date: string): void {
    this.assignments.set(studentId, date);
  }

  getDate(studentId: number): string {
    return this.assignments.get(studentId) || '';
  }

  selectAll(): void {
    this.availableStudents.forEach(s => {
      if (s.id) this.selectedStudentIds.add(s.id);
    });
  }

  deselectAll(): void {
    this.selectedStudentIds.clear();
    this.assignments.clear();
  }

  setDateForAll(date: string): void {
    this.selectedStudentIds.forEach(id => {
      this.assignments.set(id, date);
    });
  }

  canSubmit(): boolean {
    if (this.selectedStudentIds.size === 0) return false;
    for (const id of this.selectedStudentIds) {
      if (!this.assignments.has(id) || !this.assignments.get(id)) return false;
    }
    return true;
  }

  submitDistribution(): void {
    if (!this.selectedQuestionnaireId || !this.canSubmit()) return;

    this.loading = true;
    this.error = null;
    this.success = null;

    const assignmentsList: StudentExamAssignment[] = [];
    this.selectedStudentIds.forEach(studentId => {
      const date = this.assignments.get(studentId);
      if (date) {
        assignmentsList.push({studentId, scheduledDate: date});
      }
    });

    this.examScheduleService.distributeStudents({
      questionnaireId: this.selectedQuestionnaireId,
      assignments: assignmentsList
    }).subscribe({
      next: () => {
        this.success = 'تم توزيع الطلاب لأسئلة القرآن بنجاح';
        this.loading = false;
        this.selectedStudentIds.clear();
        this.assignments.clear();
        this.onQuestionnaireChange();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.error?.errorDescription || 'حدث خطأ أثناء توزيع الطلاب';
        this.loading = false;
      }
    });
  }

  cancelSchedule(scheduleId: number): void {
    if (!confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) return;
    this.examScheduleService.cancelExamSchedule(scheduleId).subscribe({
      next: () => {
        this.onQuestionnaireChange();
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

  getSelectedQuestionnaire(): Questionnaire | undefined {
    return this.questionnaires.find(q => q.id === this.selectedQuestionnaireId);
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
