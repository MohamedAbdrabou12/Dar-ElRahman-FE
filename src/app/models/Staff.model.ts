import {BaseAuditModel} from "./BaseAuditModel.model";

export interface Staff extends BaseAuditModel {
  id?: number;
  userId?: number;
  fullName: string;
  nationalId?: string;
  phoneNumber?: string;
  emailAddress?: string;
  address?: string;
  birthDate?: string;
  staffType?: StaffType;
  joiningDate?: string;
  outOfWork?: boolean;
  exitDate?: string;
  active?: boolean;
  gender: string;
  profilePictureUrl?: string;
}

export enum StaffType {
  TECHNICAL = 'TECHNICAL',
  SUPERVISOR = 'SUPERVISOR',
}
