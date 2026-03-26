import {DayOfWeek} from "./enums/DayOfWeek.enum";

export interface TimeSlot {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  periodId: number;
}
