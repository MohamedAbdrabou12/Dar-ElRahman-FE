import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MyDataService} from 'src/app/services/my-data/my-data.service';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class TeacherDashboardComponent implements OnInit {
  rings: any[] = [];
  students: any[] = [];
  teacherResults: any[] = [];
  absences: any[] = [];
  graduates: any[] = [];
  loading = true;
  error: string | null = null;
  activeTab: 'rings' | 'students' | 'absences' | 'results' | 'graduates' = 'rings';
  teacherName: string = '';

  constructor(
    private myDataService: MyDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.teacherName = this.authService.getFullName();
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading = true;
    this.error = null;

    this.myDataService.getMyRings().subscribe({
      next: (res: any) => {
        this.rings = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'حدث خطأ أثناء تحميل البيانات';
        this.loading = false;
      }
    });

    this.myDataService.getMyStudents().subscribe({
      next: (res: any) => this.students = res.data || [],
      error: () => {}
    });

    this.myDataService.getMyTeacherResults().subscribe({
      next: (res: any) => this.teacherResults = res.data || [],
      error: () => {}
    });

    this.myDataService.getMyStudentsAbsences().subscribe({
      next: (res: any) => this.absences = res.data || [],
      error: () => {}
    });

    this.myDataService.getMyGraduates().subscribe({
      next: (res: any) => this.graduates = res.data || [],
      error: () => {}
    });
  }

  setTab(tab: 'rings' | 'students' | 'absences' | 'results' | 'graduates'): void {
    this.activeTab = tab;
  }

  get totalStudents(): number {
    return this.students.length;
  }

  get totalGraduates(): number {
    return this.graduates.length;
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
}
