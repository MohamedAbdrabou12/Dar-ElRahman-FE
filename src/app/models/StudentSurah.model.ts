import {BaseAuditModel} from "./BaseAuditModel.model";
import {Surah} from "./Surah.model";
import {Grade} from "./enums/Grade.enum";

export interface StudentSurah extends BaseAuditModel {

  grade?: Grade;
  successDate?: Date;
  surah?: Surah;
}
