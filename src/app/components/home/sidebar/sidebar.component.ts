import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import {AppRoutes} from 'src/app/constants/app-routes';
import {AuthService} from 'src/app/services/auth.service';
import {MatTooltipModule} from '@angular/material/tooltip';

export interface MenuItem {
  route: string;
  label: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, MatTooltipModule],
})
export class SidebarComponent implements OnInit {
  public readonly AppRoutes = AppRoutes;
  isMinimized = false;
  filteredMenuItems: MenuItem[] = [];

  private allMenuItems: MenuItem[] = [
    // Teacher dashboard (teacher-only scoped view)
    {route: AppRoutes.TEACHER_DASHBOARD, label: 'لوحة المُعلِم', icon: 'fas fa-chalkboard', roles: ['TEACHER']},
    // Guardian dashboard (guardian-only scoped view)
    {route: AppRoutes.GUARDIAN_DASHBOARD, label: 'متابعة الطالب', icon: 'fas fa-child', roles: ['GUARDIAN']},
    // Admin & Supervisor pages
    {route: AppRoutes.ADMIN_DASHBOARD, label: 'لوحة التحكم', icon: 'fas fa-tachometer-alt', roles: ['ADMIN', 'SUPERVISOR']},
    {route: AppRoutes.STUDENT, label: 'الطلبة', icon: 'fas fa-user-graduate', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER']},
    {route: AppRoutes.PERIOD, label: 'الفترات', icon: 'fas fa-calendar-alt', roles: ['ADMIN', 'SUPERVISOR']},
    {route: AppRoutes.RING, label: 'الحلقات', icon: 'fas fa-mosque', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER']},
    {route: AppRoutes.TEACHER, label: 'المُعلِمون', icon: 'fas fa-chalkboard-teacher', roles: ['ADMIN', 'SUPERVISOR']},
    {route: AppRoutes.ABSENCE, label: 'الغياب', icon: 'fas fa-user-check', roles: ['ADMIN', 'TEACHER']},
    {route: AppRoutes.QUESTIONNAIRE, label: 'أسئلة القرآن', icon: 'fas fa-quran', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER']},
    {route: AppRoutes.EXAM_DISTRIBUTION, label: 'توزيع أسئلة القرآن', icon: 'fas fa-clipboard-list', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER']},
    {route: AppRoutes.EXAM_SCHEDULE, label: 'جدول أسئلة القرآن', icon: 'fas fa-calendar-day', roles: ['ADMIN', 'SUPERVISOR']},
    {route: AppRoutes.STUDENT_QUESTIONNAIRE, label: 'نتائج الطلبة', icon: 'fas fa-user-graduate', roles: ['ADMIN', 'TEACHER']},
    {route: AppRoutes.TEACHER_RESULT, label: 'نتائج عمل المُعَلِمين', icon: 'fas fa-chart-line', roles: ['ADMIN', 'SUPERVISOR']},
    {route: AppRoutes.GRADUATES, label: 'قائمة الخريجين (النور)', icon: 'fas fa-graduation-cap', roles: ['ADMIN', 'SUPERVISOR']},
    {route: AppRoutes.TUITIONS, label: 'الرسوم الشهرية', icon: 'fas fa-money-bill-wave', roles: ['ADMIN']},
    {route: AppRoutes.SALARY_CONFIG, label: 'شرائح الرواتب', icon: 'fas fa-money-check-alt', roles: ['ADMIN']},
    {route: AppRoutes.REPORTS, label: 'التقارير', icon: 'fas fa-file-alt', roles: ['ADMIN', 'SUPERVISOR']},
    {route: AppRoutes.STAFF, label: 'الموظفون', icon: 'fas fa-id-badge', roles: ['ADMIN']},
  ];

  constructor(protected authService: AuthService) {
  }

  ngOnInit(): void {
    this.filteredMenuItems = this.allMenuItems.filter(item =>
      this.authService.hasAnyRole(item.roles)
    );
  }

  toggleSidebar() {
    this.isMinimized = !this.isMinimized;
  }
}
