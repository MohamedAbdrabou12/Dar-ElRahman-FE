import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MyDataService} from 'src/app/services/my-data/my-data.service';

@Component({
  selector: 'app-guardian-dashboard',
  templateUrl: './guardian-dashboard.component.html',
  styleUrls: ['./guardian-dashboard.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class GuardianDashboardComponent implements OnInit {
  student: any = null;
  questionnaireResults: any[] = [];
  absences: any[] = [];
  tuitions: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private myDataService: MyDataService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading = true;
    this.error = null;

    this.myDataService.getMyStudent().subscribe({
      next: (res: any) => {
        this.student = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'حدث خطأ أثناء تحميل بيانات الطالب';
        this.loading = false;
      }
    });

    this.myDataService.getMyQuestionnaireResults().subscribe({
      next: (res: any) => this.questionnaireResults = res.data || [],
      error: () => {}
    });

    this.myDataService.getMyAbsences().subscribe({
      next: (res: any) => this.absences = res.data || [],
      error: () => {}
    });

    this.myDataService.getMyTuitions().subscribe({
      next: (res: any) => this.tuitions = res.data || [],
      error: () => {}
    });
  }

  getGradeLabel(grade: string): string {
    const gradeMap: any = {
      'excellent': 'ممتاز',
      'very_good': 'جيد جداً',
      'good': 'جيد',
      'acceptable': 'مقبول',
      'fail': 'راسب'
    };
    return gradeMap[grade] || grade || '-';
  }

  getGradeClass(grade: string): string {
    const classMap: any = {
      'excellent': 'grade-excellent',
      'very_good': 'grade-very-good',
      'good': 'grade-good',
      'acceptable': 'grade-acceptable',
      'fail': 'grade-fail'
    };
    return classMap[grade] || '';
  }

  get passedExams(): number {
    return this.questionnaireResults.filter((r: any) => r.done).length;
  }

  get totalAbsences(): number {
    return this.absences.length;
  }

  get unpaidTuitions(): any[] {
    return this.tuitions.filter((t: any) => !t.exempted && !t.paid);
  }

  get totalDue(): number {
    return this.unpaidTuitions.reduce((sum: number, t: any) => sum + (t.tuitionAmount || 0), 0);
  }
}
