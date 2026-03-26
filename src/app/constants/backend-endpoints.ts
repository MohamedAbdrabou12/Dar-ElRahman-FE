export class BackendEndpoints {
  public static register = '/api/v1/auth/register';
  public static login = '/api/v1/auth/authenticate';
  public static student = '/api/v1/students';
  public static teacher = '/api/v1/teachers';
  public static ring = '/api/v1/rings';
  public static period = '/api/v1/periods';
  public static surahs = '/api/v1/surahs';
  public static absence = '/api/v1/absences';
  public static questionnaire = '/api/v1/questionnaires';
  public static student_questionnaire = '/api/v1/student-questionnaires';
  public static teacher_result = '/api/v1/teacher-results';
  public static graduates = '/api/v1/graduates';
  public static tuitions = '/api/v1/tuitions';
  public static staff = '/api/v1/staff';
  public static activate = '/api/v1/auth/activate';
  public static resendActivation = '/api/v1/auth/resend-activation';
  public static forgotPassword = '/api/v1/auth/forgot-password';
  public static validateResetToken = '/api/v1/auth/reset-password';
  public static resetPassword = '/api/v1/auth/reset-password';
  public static examSchedule = '/api/v1/exam-schedules';
  public static salarySlabs = '/api/v1/salary-slabs';
  public static profile = '/api/v1/profile';
}
