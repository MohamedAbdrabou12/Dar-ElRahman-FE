/**
 * Centralized role-based permissions for all features.
 * ADMIN always has full access.
 * SUPERVISOR and TECHNICAL have feature-specific permissions.
 * TEACHER retains its existing access unchanged.
 * GUARDIAN retains its existing access unchanged.
 */
export const PERMISSIONS = {
  student: {
    view: ['ADMIN', 'SUPERVISOR', 'TEACHER', 'TECHNICAL'],
    add: ['ADMIN', 'SUPERVISOR'],
    edit: ['ADMIN', 'SUPERVISOR'],
    delete: ['ADMIN', 'SUPERVISOR'],
    certificate: ['ADMIN', 'SUPERVISOR'],
    surah: ['ADMIN', 'SUPERVISOR', 'TECHNICAL'],
  },
  ring: {
    view: ['ADMIN', 'SUPERVISOR', 'TEACHER'],
    add: ['ADMIN', 'SUPERVISOR'],
    edit: ['ADMIN', 'SUPERVISOR'],
    delete: ['ADMIN', 'SUPERVISOR'],
  },
  teacher: {
    view: ['ADMIN', 'SUPERVISOR'],
    add: ['ADMIN', 'SUPERVISOR'],
    edit: ['ADMIN', 'SUPERVISOR'],
    delete: ['ADMIN', 'SUPERVISOR'],
  },
  absence: {
    view: ['ADMIN', 'SUPERVISOR', 'TEACHER', 'TECHNICAL'],
    add: ['ADMIN', 'SUPERVISOR', 'TEACHER', 'TECHNICAL'],
    edit: ['ADMIN', 'SUPERVISOR', 'TEACHER', 'TECHNICAL'],
    delete: ['ADMIN', 'SUPERVISOR', 'TEACHER'],
  },
  questionnaire: {
    view: ['ADMIN', 'SUPERVISOR', 'TEACHER'],
    add: ['ADMIN', 'SUPERVISOR'],
    edit: ['ADMIN', 'SUPERVISOR'],
    delete: ['ADMIN', 'SUPERVISOR'],
  },
  examDistribution: {
    view: ['ADMIN', 'SUPERVISOR', 'TEACHER', 'TECHNICAL'],
    add: ['ADMIN', 'SUPERVISOR', 'TEACHER', 'TECHNICAL'],
    edit: ['ADMIN', 'SUPERVISOR', 'TEACHER', 'TECHNICAL'],
    cancel: ['ADMIN', 'SUPERVISOR', 'TEACHER', 'TECHNICAL'],
  },
  examSchedule: {
    view: ['ADMIN', 'SUPERVISOR', 'TECHNICAL'],
    add: ['ADMIN', 'SUPERVISOR', 'TECHNICAL'],
    edit: ['ADMIN', 'SUPERVISOR', 'TECHNICAL'],
    cancel: ['ADMIN', 'SUPERVISOR', 'TECHNICAL'],
  },
  studentResult: {
    view: ['ADMIN', 'SUPERVISOR', 'TEACHER', 'TECHNICAL'],
    add: ['ADMIN', 'SUPERVISOR', 'TEACHER'],
    edit: ['ADMIN', 'SUPERVISOR', 'TEACHER'],
  },
  teacherResult: {
    view: ['ADMIN', 'SUPERVISOR'],
    add: ['ADMIN', 'SUPERVISOR'],
    edit: ['ADMIN', 'SUPERVISOR'],
  },
  graduate: {
    view: ['ADMIN', 'SUPERVISOR', 'TECHNICAL'],
    add: ['ADMIN', 'SUPERVISOR'],
    edit: ['ADMIN', 'SUPERVISOR'],
    delete: ['ADMIN', 'SUPERVISOR'],
  },
  tuition: {
    view: ['ADMIN', 'SUPERVISOR'],
    add: ['ADMIN', 'SUPERVISOR'],
    edit: ['ADMIN', 'SUPERVISOR'],
    delete: ['ADMIN', 'SUPERVISOR'],
  },
  staff: {
    view: ['ADMIN', 'SUPERVISOR'],
    add: ['ADMIN'],
    edit: ['ADMIN'],
    delete: ['ADMIN'],
    export: ['ADMIN', 'SUPERVISOR'],
  },
  period: {
    view: ['ADMIN', 'SUPERVISOR'],
    add: ['ADMIN', 'SUPERVISOR'],
    edit: ['ADMIN', 'SUPERVISOR'],
    delete: ['ADMIN', 'SUPERVISOR'],
  },
  reports: {
    financial: ['ADMIN', 'SUPERVISOR'],
    outstanding: ['ADMIN', 'SUPERVISOR'],
    student: ['ADMIN', 'SUPERVISOR', 'TECHNICAL'],
    teacherRings: ['ADMIN', 'SUPERVISOR', 'TECHNICAL'],
    teacherPerformance: ['ADMIN', 'SUPERVISOR'],
    examSchedule: ['ADMIN', 'SUPERVISOR', 'TECHNICAL'],
    periodSummary: ['ADMIN', 'SUPERVISOR'],
  },
} as const;
