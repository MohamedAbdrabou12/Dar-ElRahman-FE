import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {DayOfWeek} from '../../../../models/enums/DayOfWeek.enum';
import {Period} from '../../../../models/Period.model';
import {TimeSlot} from '../../../../models/TimeSlot.model';

export interface PeriodDialogData {
  isEdit: boolean;
  period?: Period;
}

@Component({
  selector: 'app-add-period-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './add-period-dialog.component.html',
  styleUrls: ['./add-period-dialog.component.scss']
})
export class AddPeriodDialogComponent implements OnInit {
  periodForm!: FormGroup;
  daysOfWeek = Object.values(DayOfWeek);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPeriodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodDialogData
  ) {
  }

  ngOnInit(): void {
    this.initForm();

    if (this.data.isEdit && this.data.period) {
      this.periodForm.patchValue({
        id: this.data.period.id,
        name: this.data.period.name,
        description: this.data.period.description,
        monthlyTuition: this.data.period.monthlyTuition
      });

      if (this.data.period.timeSlots && this.data.period.timeSlots.length > 0) {
        this.data.period.timeSlots.forEach(slot => {
          this.addTimeSlot(slot);
        });
      }
    }
  }

  private initForm(): void {
    this.periodForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      monthlyTuition: [null, [Validators.min(0)]],
      timeSlots: this.fb.array([])
    });
  }

  get timeSlots(): FormArray {
    return this.periodForm.get('timeSlots') as FormArray;
  }

  createTimeSlotFormGroup(slot?: TimeSlot): FormGroup {
    return this.fb.group({
      id: [slot?.id || null],
      dayOfWeek: [slot?.dayOfWeek || '', Validators.required],
      startTime: [slot?.startTime || '', Validators.required],
      endTime: [slot?.endTime || '', Validators.required]
    });
  }

  addTimeSlot(slot?: TimeSlot): void {
    this.timeSlots.push(this.createTimeSlotFormGroup(slot));
  }

  removeTimeSlot(index: number): void {
    this.timeSlots.removeAt(index);
  }

  getDayOfWeekArabic(day: string): string {
    const daysMap: { [key: string]: string } = {
      SUNDAY: 'الأحد',
      MONDAY: 'الإثنين',
      TUESDAY: 'الثلاثاء',
      WEDNESDAY: 'الأربعاء',
      THURSDAY: 'الخميس',
      FRIDAY: 'الجمعة',
      SATURDAY: 'السبت'
    };
    return daysMap[day] || day;
  }

  validateTimeSlots(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const slots = this.timeSlots.value;

    // Check for duplicate days
    const days: string[] = slots.map((slot: any) => slot.dayOfWeek);
    const duplicateDays = days.filter((day: string, index: number) => days.indexOf(day) !== index);

    if (duplicateDays.length > 0) {
      const uniqueDuplicates = [...new Set(duplicateDays)];
      uniqueDuplicates.forEach((day) => {
        errors.push(`يوم ${this.getDayOfWeekArabic(day)} مكرر`);
      });
    }

    // Check for time validations
    slots.forEach((slot: any, index: number) => {
      if (slot.startTime && slot.endTime) {
        // Check if start time is less than end time
        if (slot.startTime >= slot.endTime) {
          errors.push(`في ${this.getDayOfWeekArabic(slot.dayOfWeek)}: وقت البداية يجب أن يكون أقل من وقت النهاية`);
        }

        // Check for overlapping times on the same day
        slots.forEach((otherSlot: any, otherIndex: number) => {
          if (index !== otherIndex && slot.dayOfWeek === otherSlot.dayOfWeek) {
            const start1 = slot.startTime;
            const end1 = slot.endTime;
            const start2 = otherSlot.startTime;
            const end2 = otherSlot.endTime;

            if ((start1 < end2 && end1 > start2)) {
              errors.push(`في ${this.getDayOfWeekArabic(slot.dayOfWeek)}: توجد أوقات متداخلة`);
            }
          }
        });
      }
    });

    // Remove duplicate error messages
    const uniqueErrors = [...new Set(errors)];
    return {valid: uniqueErrors.length === 0, errors: uniqueErrors};
  }

  private formatTime(time: string): string {
    if (!time) return time;
    // Ensure HH:mm format (e.g., "09:30" not "9:30")
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  onSubmit(): void {
    if (this.periodForm.valid) {
      const validation = this.validateTimeSlots();

      if (!validation.valid) {
        alert('خطأ في التحقق:\n' + validation.errors.join('\n'));
        return;
      }

      const formValue = this.periodForm.value;
      
      // Format timeSlots to ensure HH:mm format for backend
      if (formValue.timeSlots && formValue.timeSlots.length > 0) {
        formValue.timeSlots = formValue.timeSlots.map((slot: any) => ({
          ...slot,
          startTime: this.formatTime(slot.startTime),
          endTime: this.formatTime(slot.endTime)
        }));
      }

      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
