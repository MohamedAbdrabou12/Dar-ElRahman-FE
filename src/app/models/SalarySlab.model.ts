import {BaseAuditModel} from "./BaseAuditModel.model";

export interface SalarySlab extends BaseAuditModel {
  id?: number;
  label: string;
  minPercentage: number;
  maxPercentage: number;
  salaryAmount: number;
  displayOrder: number;
}
