import {BaseAuditModel} from "./BaseAuditModel.model";
import {Teacher} from "./Teacher.model";

export interface TeacherResult extends BaseAuditModel {
  id?: number;
  resultDate?: Date;
  resultCalculationDate?: Date;
  memorizationCount?: number;
  memorizationSuccessCount?: number;
  memorizationStudentCount?: number;
  revisionCount?: number;
  revisionSuccessCount?: number;
  revisionStudentCount?: number;
  firstQuestionSuccessCount?: number;
  secondQuestionSuccessCount?: number;
  thirdQuestionSuccessCount?: number;
  memorizationPercentage?: number;
  revisionPercentage?: number;
  adjustmentValue?: number;
  successPercentage?: number;
  teacherId?: number;
  teacher?: Teacher;
}
