import {BaseAuditModel} from "./BaseAuditModel.model";
import {Grade} from "./enums/Grade.enum";
import {Student} from "./Student.model";
import {Questionnaire} from "./Questionnaire.model";

export interface StudentQuestionnaire extends BaseAuditModel {
  id?: number;
  grade?: Grade;
  successDate?: Date;
  done?: boolean;
  studentId?: number;
  student?: Student;
  questionnaireId?: number;
  questionnaire?: Questionnaire;
}
