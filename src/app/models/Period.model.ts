import {TimeSlot} from "./TimeSlot.model";

export interface Period {
  id: number;
  name: string;
  description?: string;
  monthlyTuition?: number;
  maxExamsPerDay?: number;
  timeSlots: TimeSlot[];
  createdAt?: string;
  updatedAt?: string;
}
