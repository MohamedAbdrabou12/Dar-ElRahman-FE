import {BaseAuditModel} from "./BaseAuditModel.model";
import {ExamStatus} from "./enums/ExamStatus.enum";
import {Student} from "./Student.model";
import {Questionnaire} from "./Questionnaire.model";

export interface ExamSchedule extends BaseAuditModel {
  id?: number;
  studentId?: number;
  student?: Student;
  questionnaireId?: number;
  questionnaire?: Questionnaire;
  scheduledDate?: string;
  status?: ExamStatus;
}

export interface StudentExamAssignment {
  studentId: number;
  scheduledDate: string;
}

export interface ExamDistributionRequest {
  questionnaireId: number;
  assignments: StudentExamAssignment[];
}
