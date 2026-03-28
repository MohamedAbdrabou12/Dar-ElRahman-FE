import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {DashboardService, DashboardStats} from '../../../services/dashboard/dashboard.service';
import {AppRoutes} from '../../../constants/app-routes';

export interface MetricCard {
  title: string;
  icon: string;
  iconBg: string;
  metrics: { label: string; value: number; color?: string }[];
  route?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error = false;
  cards: MetricCard[] = [];

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = false;
    this.dashboardService.getStats().subscribe({
      next: (res: any) => {
        this.stats = res.data;
        this.buildCards();
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  private buildCards(): void {
    if (!this.stats) return;
    this.cards = [
      {
        title: 'الطلبة',
        icon: 'fas fa-user-graduate',
        iconBg: 'bg-blue-500',
        route: AppRoutes.STUDENT,
        metrics: [
          {label: 'إجمالي', value: this.stats.totalStudents},
          {label: 'متصل', value: this.stats.activeStudents, color: 'text-green-600'},
          {label: 'منقطع', value: this.stats.inactiveStudents, color: 'text-red-500'},
        ],
      },
      {
        title: 'المُعلِمون',
        icon: 'fas fa-chalkboard-teacher',
        iconBg: 'bg-emerald-500',
        route: AppRoutes.TEACHER,
        metrics: [
          {label: 'إجمالي', value: this.stats.totalTeachers},
          {label: 'نشط', value: this.stats.activeTeachers, color: 'text-green-600'},
          {label: 'خارج العمل', value: this.stats.outOfWorkTeachers, color: 'text-amber-500'},
        ],
      },
      {
        title: 'الحلقات',
        icon: 'fas fa-mosque',
        iconBg: 'bg-violet-500',
        route: AppRoutes.RING,
        metrics: [
          {label: 'إجمالي', value: this.stats.totalRings},
        ],
      },
      {
        title: 'الفترات',
        icon: 'fas fa-calendar-alt',
        iconBg: 'bg-cyan-500',
        route: AppRoutes.PERIOD,
        metrics: [
          {label: 'إجمالي', value: this.stats.totalPeriods},
        ],
      },
      {
        title: 'أسئلة القرآن',
        icon: 'fas fa-quran',
        iconBg: 'bg-teal-500',
        route: AppRoutes.QUESTIONNAIRE,
        metrics: [
          {label: 'إجمالي', value: this.stats.totalQuestionnaires},
          {label: 'مكتملة', value: this.stats.completedQuestionnaires, color: 'text-green-600'},
          {label: 'قيد التنفيذ', value: this.stats.pendingQuestionnaires, color: 'text-amber-500'},
        ],
      },
      {
        title: 'أسئلة اليوم',
        icon: 'fas fa-calendar-day',
        iconBg: 'bg-orange-500',
        route: AppRoutes.EXAM_SCHEDULE,
        metrics: [
          {label: 'مجدولة', value: this.stats.examsScheduledToday},
          {label: 'في الانتظار', value: this.stats.pendingExamsToday, color: 'text-amber-500'},
        ],
      },
      {
        title: 'الخريجون (النور)',
        icon: 'fas fa-graduation-cap',
        iconBg: 'bg-yellow-500',
        route: AppRoutes.GRADUATES,
        metrics: [
          {label: 'إجمالي', value: this.stats.totalGraduates},
        ],
      },
      {
        title: 'الغياب هذا الشهر',
        icon: 'fas fa-user-check',
        iconBg: 'bg-red-500',
        route: AppRoutes.ABSENCE,
        metrics: [
          {label: 'حالات الغياب', value: this.stats.absencesThisMonth},
        ],
      },
      {
        title: 'الرسوم هذا الشهر',
        icon: 'fas fa-money-bill-wave',
        iconBg: 'bg-green-600',
        route: AppRoutes.TUITIONS,
        metrics: [
          {label: 'فواتير صادرة', value: this.stats.tuitionsThisMonth},
        ],
      },
    ];
  }

  navigateTo(route?: string): void {
    if (route) {
      this.router.navigate(['/', AppRoutes.HOME, route]);
    }
  }
}
