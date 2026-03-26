import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Teacher } from '../../../../models/Teacher.model';
import { TeacherResult } from '../../../../models/TeacherResult.model';

export interface TeacherResultDialogData {
  isEdit: boolean;
  teacherResult?: TeacherResult;
  teachers: Teacher[];
}

@Component({
  selector: 'app-add-teacher-result-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './add-teacher-result-dialog.component.html',
  styleUrls: ['./add-teacher-result-dialog.component.scss']
})
export class AddTeacherResultDialogComponent implements OnInit {
  teacherResultForm!: FormGroup;
  teachers: Teacher[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddTeacherResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeacherResultDialogData
  ) {
    this.teachers = data.teachers;
  }

  ngOnInit(): void {
    this.initForm();
    
    if (this.data.isEdit && this.data.teacherResult) {
      // Find matching teacher from list for proper binding
      const selectedTeacher = this.teachers.find(t => t.id === this.data.teacherResult?.teacherId);
      
      this.teacherResultForm.patchValue({
        id: this.data.teacherResult.id,
        teacher: selectedTeacher || null,
        resultDate: this.formatDateForInput(this.data.teacherResult.resultDate),
        resultCalculationDate: this.formatDateForInput(this.data.teacherResult.resultCalculationDate),
        memorizationCount: this.data.teacherResult.memorizationCount,
        memorizationSuccessCount: this.data.teacherResult.memorizationSuccessCount,
        memorizationStudentCount: this.data.teacherResult.memorizationStudentCount,
        revisionCount: this.data.teacherResult.revisionCount,
        revisionSuccessCount: this.data.teacherResult.revisionSuccessCount,
        revisionStudentCount: this.data.teacherResult.revisionStudentCount,
        firstQuestionSuccessCount: this.data.teacherResult.firstQuestionSuccessCount,
        secondQuestionSuccessCount: this.data.teacherResult.secondQuestionSuccessCount,
        thirdQuestionSuccessCount: this.data.teacherResult.thirdQuestionSuccessCount,
        memorizationPercentage: this.data.teacherResult.memorizationPercentage,
        revisionPercentage: this.data.teacherResult.revisionPercentage,
        adjustmentValue: this.data.teacherResult.adjustmentValue,
        successPercentage: this.data.teacherResult.successPercentage
      });
    }
  }

  private initForm(): void {
    this.teacherResultForm = this.fb.group({
      id: [null],
      teacher: [null, Validators.required],
      resultDate: ['', Validators.required],
      resultCalculationDate: [''],
      memorizationCount: [0, [Validators.required, Validators.min(0)]],
      memorizationSuccessCount: [0, [Validators.required, Validators.min(0)]],
      memorizationStudentCount: [0, [Validators.required, Validators.min(0)]],
      revisionCount: [0, [Validators.required, Validators.min(0)]],
      revisionSuccessCount: [0, [Validators.required, Validators.min(0)]],
      revisionStudentCount: [0, [Validators.required, Validators.min(0)]],
      firstQuestionSuccessCount: [0, Validators.min(0)],
      secondQuestionSuccessCount: [0, Validators.min(0)],
      thirdQuestionSuccessCount: [0, Validators.min(0)],
      memorizationPercentage: [0],
      revisionPercentage: [0],
      adjustmentValue: [0],
      successPercentage: [0]
    });
  }

  private formatDateForInput(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.teacherResultForm.valid) {
      const formValue = this.teacherResultForm.value;
      const formattedData = {
        ...formValue,
        resultDate: this.formatDate(formValue.resultDate),
        resultCalculationDate: this.formatDate(formValue.resultCalculationDate)
      };
      this.dialogRef.close(formattedData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
