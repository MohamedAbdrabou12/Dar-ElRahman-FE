import {BaseAuditModel} from "./BaseAuditModel.model";
import {Grade} from "./enums/Grade.enum";
import {Student} from "./Student.model";

export interface Graduate extends BaseAuditModel {
  id?: number;
  finalGrade?: Grade;
  completionDate?: Date;
  studentId?: number;
  student?: Student;
}
