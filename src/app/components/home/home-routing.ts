import {Routes} from '@angular/router';
import {AppRoutes} from "../../constants/app-routes";
import {roleGuard} from "../../core/guards/role-guard";

export const HOME_CHILDREN_ROUTES: Routes = [
  {
    path: AppRoutes.STUDENT,
    loadComponent: () =>
      import('./student/student.component').then(
        (c) => c.StudentComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'TEACHER', 'SUPERVISOR']},
  },
  {
    path: AppRoutes.TEACHER,
    loadComponent: () =>
      import('./teacher/teacher.component').then(
        (c) => c.TeacherComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'SUPERVISOR']},
  },
  {
    path: AppRoutes.SURAHS,
    loadComponent: () =>
      import('./surahs/surahs.component').then(
        (c) => c.SurahsComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'TEACHER', 'SUPERVISOR']},
  },
  {
    path: AppRoutes.ABSENCE,
    loadComponent: () =>
      import('./absence/absence.component').then(
        (c) => c.AbsenceComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'TEACHER']},
  },
  {
    path: AppRoutes.RING,
    loadComponent: () =>
      import('./ring/ring.component').then(
        (c) => c.RingComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'SUPERVISOR']},
  },
  {
    path: AppRoutes.PERIOD,
    loadComponent: () =>
      import('./period/period.component').then(
        (c) => c.PeriodComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'SUPERVISOR']},
  },
  {
    path: AppRoutes.QUESTIONNAIRE,
    loadComponent: () =>
      import('./questionnaire/questionnaire.component').then(
        (c) => c.QuestionnaireComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'TEACHER', 'SUPERVISOR']},
  },
  {
    path: AppRoutes.STUDENT_QUESTIONNAIRE,
    loadComponent: () =>
      import('./student-questionnaire/student-questionnaire.component').then(
        (c) => c.StudentQuestionnaireComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'TEACHER']},
  },
  {
    path: AppRoutes.TEACHER_RESULT,
    loadComponent: () =>
      import('./teacher-result/teacher-result.component').then(
        (c) => c.TeacherResultComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'SUPERVISOR']},
  },
  {
    path: AppRoutes.GRADUATES,
    loadComponent: () =>
      import('./graduate/graduate.component').then(
        (c) => c.GraduateComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'TEACHER', 'SUPERVISOR']},
  },
  {
    path: AppRoutes.TUITIONS,
    loadComponent: () =>
      import('./tuition/tuition.component').then(
        (c) => c.TuitionComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN']},
  },
  {
    path: AppRoutes.STAFF,
    loadComponent: () =>
      import('./staff/staff.component').then(
        (c) => c.StaffComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN']},
  },
  {
    path: AppRoutes.EXAM_DISTRIBUTION,
    loadComponent: () =>
      import('./exam-distribution/exam-distribution.component').then(
        (c) => c.ExamDistributionComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'TEACHER']},
  },
  {
    path: AppRoutes.EXAM_SCHEDULE,
    loadComponent: () =>
      import('./exam-schedule/exam-schedule.component').then(
        (c) => c.ExamScheduleComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN', 'SUPERVISOR']},
  },
  {
    path: AppRoutes.SALARY_CONFIG,
    loadComponent: () =>
      import('./salary-config/salary-config.component').then(
        (c) => c.SalaryConfigComponent,
      ),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN']},
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoutes.STUDENT,
  },
];
