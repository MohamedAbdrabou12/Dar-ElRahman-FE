import {BaseAuditModel} from "./BaseAuditModel.model";
import {Student} from "./Student.model";

export interface Tuition extends BaseAuditModel {
  id?: number;
  tuitionDate?: Date;
  tuitionAmount?: number;
  tuitionMonth?: string;
  studentId?: number;
  exempted?: boolean;
  paid?: boolean;
  student?: Student;
}
