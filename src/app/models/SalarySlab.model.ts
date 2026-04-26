import {BaseAuditModel} from "./BaseAuditModel.model";

export interface SalarySlab extends BaseAuditModel {
  id?: number;
  periodId?: number;
  periodName?: string;
  label: string;
  minPercentage: number;
  maxPercentage: number;
  salaryAmount: number;
  displayOrder: number;
}
