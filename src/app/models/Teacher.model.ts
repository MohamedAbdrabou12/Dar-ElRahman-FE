import {BaseAuditModel} from "./BaseAuditModel.model";
import {TeacherMaritalStatus} from "./enums/TeacherMaritalStatus.enum";

export interface Teacher extends BaseAuditModel {
  id?: number; // Optional because it might be auto-generated
  fullName: string; // Required, min 5, max 100 characters
  nationalId?: string; // Optional, must match NATIONAL_ID_PATTERN
  phoneNumber?: string; // Optional, must match EGP_MOBILE_PATTERN
  emailAddress?: string; // Optional, must match EMAIL_PATTERN
  address?: string; // Optional
  birthDate?: string; // Optional, format: yyyy-MM-dd
  maritalStatus?: TeacherMaritalStatus; // Enum type
  profession?: string; // Optional
  educationalQualification?: string; // Optional
  qualificationDate?: string; // Optional, format: yyyy-MM
  joiningDate?: string; // Optional, format: yyyy-MM-dd
  outOfWork?: boolean; // Optional
  exitDate?: string; // Optional, format: yyyy-MM-dd
  deleted?: boolean; // Optional
}
