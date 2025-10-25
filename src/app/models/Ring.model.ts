import {BaseAuditModel} from "./BaseAuditModel.model";
import {Period} from "./enums/Period.enum";
import {MemorizationPart} from "./enums/MemorizationPart.enum";

export interface Ring extends BaseAuditModel {
  id?: number; // Optional because it might be auto-generated
  name: string; // Required, min 5, max 255 characters
  studentCount?: number; // Optional
  period: Period; // Enum type
  memorizationPart?: MemorizationPart;
  teacherId: number; // Required
  teacherName: string;
}
