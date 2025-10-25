import {BaseAuditModel} from "./BaseAuditModel.model";

export interface QuestionnaireResult extends BaseAuditModel {
  id?: number;
  questionPoints?: number;
  successCount?: number;
  failedCount?: number;
  absenceCount?: number;
  successPercentage?: number;
  revisionPercentage?: number;
}
