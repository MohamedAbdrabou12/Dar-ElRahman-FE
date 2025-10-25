import {QuestionType} from "./enums/QuestionType.enum.js";
import {QuestionnaireType} from "./enums/QuestionnaireType.enum";
import {BaseAuditModel} from "./BaseAuditModel.model";
import {Ring} from "./Ring.model";
import {Surah} from "./Surah.model";
import {QuestionnaireResult} from "./QuestionnaireResult.model";

export interface Questionnaire extends BaseAuditModel {
  id?: number;
  questionnaireType?: QuestionnaireType;
  fromVerse?: number;
  toVerse?: number;
  questionDate?: Date;
  questionType?: QuestionType;
  nextQuestionDate?: Date;
  currentSurah?: Surah;
  nextSurah?: Surah;
  ringId?: number;
  ring?: Ring;
  done?: boolean;
  questionnaireResult?: QuestionnaireResult;
}
