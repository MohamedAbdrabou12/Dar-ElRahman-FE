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
  active?: boolean;
  gender: string;
  profilePictureUrl?: string;
}

export enum StaffType {
  ADMIN = 'ADMIN',
  TECHNICAL = 'TECHNICAL',
  SUPERVISOR = 'SUPERVISOR',
}
