import {BaseAuditModel} from "./BaseAuditModel.model";
import {Student} from "./Student.model";

export interface Tuition extends BaseAuditModel {
  id?: number;
  tuitionDate?: Date;
  tuitionAmount?: number;
  studentId?: number;
  student?: Student;
}
