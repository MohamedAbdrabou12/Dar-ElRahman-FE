export const AppRegexPatterns = {
  EMAIL_PATTERN: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$',
  EGP_MOBILE_PATTERN: '^01[0125]\\d{8}$',
  PASSWORD_PATTERN: '^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$',
  NATIONAL_ID_PATTERN:
    '^[23]\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{2}\\d{4}\\d$',
};
