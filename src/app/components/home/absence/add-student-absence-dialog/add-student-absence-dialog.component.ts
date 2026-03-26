import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StudentService } from 'src/app/services/student/student.service';
import { Student } from 'src/app/models/Student.model';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import {StudentAbsenceService} from "../../../../services/absence/absence.service";

@Component({
  selector: 'app-add-absence-dialog',
  standalone: true,
  templateUrl: './add-student-absence-dialog.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule
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

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    this.absenceForm.markAllAsTouched();

    if (this.absenceForm.valid) {

      const { id, studentId, absenceDate } = this.absenceForm.getRawValue();


      this.loadingService.startLoading();

      if (this.data?.mode === 'edit') {
        // Update
        const payload = { 
          id,
          studentId,
          absenceDate: this.formatDate(absenceDate)
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
          absenceDate: this.formatDate(absenceDate)
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
