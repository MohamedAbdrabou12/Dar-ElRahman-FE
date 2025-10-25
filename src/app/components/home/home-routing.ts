import {Routes} from '@angular/router';
import {AppRoutes} from "../../constants/app-routes";

export const HOME_CHILDREN_ROUTES: Routes = [
  {
    path: AppRoutes.STUDENT,
    loadComponent: () =>
      import('./student/student.component').then(
        (c) => c.StudentComponent,
      ),
  },
  {
    path: AppRoutes.TEACHER,
    loadComponent: () =>
      import('./teacher/teacher.component').then(
        (c) => c.TeacherComponent,
      ),
  },
  {
    path: AppRoutes.SURAHS,
    loadComponent: () =>
      import('./surahs/surahs.component').then(
        (c) => c.SurahsComponent,
      ),
  },
  {
    path: AppRoutes.ABSENCE,
    loadComponent: () =>
      import('./absence/absence.component').then(
        (c) => c.AbsenceComponent,
      ),
  },
  {
    path: AppRoutes.RING,
    loadComponent: () =>
      import('./ring/ring.component').then(
        (c) => c.RingComponent,
      ),
  },
  {
    path: AppRoutes.QUESTIONNAIRE,
    loadComponent: () =>
      import('./questionnaire/questionnaire.component').then(
        (c) => c.QuestionnaireComponent,
      ),
  },
  {
    path: AppRoutes.STUDENT_QUESTIONNAIRE,
    loadComponent: () =>
      import('./student-questionnaire/student-questionnaire.component').then(
        (c) => c.StudentQuestionnaireComponent,
      ),
  },
  {
    path: AppRoutes.TEACHER_RESULT,
    loadComponent: () =>
      import('./teacher-result/teacher-result.component').then(
        (c) => c.TeacherResultComponent,
      ),
  },
  {
    path: AppRoutes.GRADUATES,
    loadComponent: () =>
      import('./graduate/graduate.component').then(
        (c) => c.GraduateComponent,
      ),
  },
  {
    path: AppRoutes.TUITIONS,
    loadComponent: () =>
      import('./tuition/tuition.component').then(
        (c) => c.TuitionComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoutes.STUDENT,
  },
];
