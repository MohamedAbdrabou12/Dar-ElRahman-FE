import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatDialogActions
} from '@angular/material/dialog';
import { StudentService } from 'src/app/services/student/student.service';
import { Student } from 'src/app/models/Student.model';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import {StudentAbsenceService} from "../../../../services/absence/absence.service";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatOption, MatSelect, MatLabel} from "@angular/material/select";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter} from "@angular/material/core";
import {DatePipe} from "@angular/common";

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-absence-dialog',
  templateUrl: './add-student-absence-dialog.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatDatepickerToggle,
    MatInput,
    MatDatepicker,
    MatDatepickerInput,
    MatButton,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },  // Optional: Set your locale (e.g., 'en-US' or 'en-GB')
    { provide: DateAdapter, useClass: NativeDateAdapter }, // Provide the NativeDateAdapter
    DatePipe,
  ],
  styleUrls: ['./add-student-absence-dialog.component.scss']
})
export class AddAbsenceDialogComponent implements OnInit {
  absenceForm!: FormGroup;
  students: Student[] = [];
  today: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private absenceService: StudentAbsenceService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<AddAbsenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadStudents();
  }

  buildForm() {
    this.absenceForm = this.fb.group({
      id: [this.data?.details?.id || ''],
      studentId: [
        { value: this.data?.details?.studentId || '', disabled: this.data?.mode === 'edit' },
        Validators.required
      ],
      absenceDate: [this.data?.details?.absenceDate || '', Validators.required]
    });
  }

  loadStudents() {
    this.studentService.getAllStudent().subscribe(res => {
      this.students = res.data;
    });
  }

  onSubmit() {
    this.absenceForm.markAllAsTouched();

    if (this.absenceForm.valid) {

      const { id, studentId, absenceDate } = this.absenceForm.getRawValue();


      this.loadingService.startLoading();

      if (this.data?.mode === 'edit') {
        // Update
        const payload = { id,
          studentId,
          absenceDate: this.datePipe.transform(absenceDate, 'yyyy-MM-dd')
        };

        this.absenceService.updateStudentAbsence(payload).subscribe({
          next: () => {
            this.alertService.success('تم التحديث بنجاح');
            this.loadingService.stopLoading();
            this.dialogRef.close(true);
          },
          error: () => {
            this.alertService.error('فشل في التحديث');
            this.loadingService.stopLoading();
          }
        });
      } else {
        // Create
        const payload = {
          studentId,
          absenceDate: this.datePipe.transform(absenceDate, 'yyyy-MM-dd')
        };
        this.absenceService.createStudentAbsence(payload).subscribe({
          next: () => {
            this.alertService.success('تم الإضافة بنجاح');
            this.dialogRef.close(true);
            this.loadingService.stopLoading();
          },
          error: () => {
            this.alertService.error('فشل في الإضافة');
            this.loadingService.stopLoading();
          }
        });
      }
    }
  }
}
