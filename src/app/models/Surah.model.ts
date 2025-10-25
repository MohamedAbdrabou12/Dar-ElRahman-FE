import {BaseAuditModel} from "./BaseAuditModel.model";

export interface Surah extends BaseAuditModel {

  id?: number;
  name?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  numberOfVerses?: string;
  fromPage?: number;
  toPage?: number;
  meccan?: boolean;
}
