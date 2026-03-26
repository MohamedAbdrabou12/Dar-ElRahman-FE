import {Ring} from "./Ring.model";
import {BaseAuditModel} from "./BaseAuditModel.model";
import {Status} from "./enums/Status.enum";
import {StudentMaritalStatus} from "./enums/StudentMaritalStatus.enum";

export interface Student extends BaseAuditModel {
  id?: number;
  userId?: number;
  fullName: string;
  nationalId?: string;
  birthDate?: string;
  status?: Status;
  address?: string;
  maritalStatus?: StudentMaritalStatus;
  joiningDate?: string;
  fatherPhoneNumber?: string;
  fatherEmailAddress?: string;
  motherPhoneNumber?: string;
  motherName?: string;
  gender: string;
  profilePictureUrl?: string;
  ringId?: number;
  ring?: Ring;
  periodName: string;
}
