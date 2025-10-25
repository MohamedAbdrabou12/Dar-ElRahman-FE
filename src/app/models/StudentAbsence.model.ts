import { BaseAuditModel } from "./BaseAuditModel.model";
import {Ring} from "./Ring.model";
import {Student} from "./Student.model";

export interface StudentAbsence extends BaseAuditModel {
  id: number;
  studentId: number;
  absenceDate: string;
  absenceCounter?: number;
  student?: Student;
}
