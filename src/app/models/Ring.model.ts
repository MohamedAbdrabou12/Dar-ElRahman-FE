import {BaseAuditModel} from "./BaseAuditModel.model";
import {MemorizationOrder} from "./enums/MemorizationOrder.enum";
import {MemorizationPart} from "./enums/MemorizationPart.enum";

export interface Ring extends BaseAuditModel {
  id?: number; // Optional because it might be auto-generated
  name: string; // Required, min 5, max 255 characters
  studentCount?: number; // Optional
  periodId: number; // Period entity reference
  periodName?: string; // Optional for display
  memorizationPart?: MemorizationPart;
  memorizationOrder?: MemorizationOrder;
  teacherId: number; // Required
  teacherName: string;
  maxExamBatch?: number;
}
