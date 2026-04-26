import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Student } from '../../../../models/Student.model';
import { Graduate } from '../../../../models/Graduate.model';
import { Grade } from '../../../../models/enums/Grade.enum';
import { GraduateService } from '../../../../services/graduate/graduate.service';
import { AlertService } from '../../../../services/alert.service';

export interface GraduateDialogData {
  isEdit: boolean;
  graduate?: Graduate;
  students: Student[];
}

@Component({
  selector: 'app-add-graduate-dialog',
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
  templateUrl: './add-graduate-dialog.component.html',
  styleUrls: ['./add-graduate-dialog.component.scss']
})
export class AddGraduateDialogComponent implements OnInit {
  graduateForm!: FormGroup;
  students: Student[] = [];
  grades: string[] = Object.values(Grade);
  
  private gradeMap: { [key: string]: string } = {
    [Grade.excellent]: 'ممتاز',
    [Grade.very_good]: 'جيد جدا',
    [Grade.good]: 'جيد'
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddGraduateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GraduateDialogData,
    private graduateService: GraduateService,
    private alertService: AlertService
  ) {
    this.students = data.students;
  }

  ngOnInit(): void {
    this.initForm();
    
    if (this.data.isEdit && this.data.graduate) {
      // Check both studentId and student.id for proper binding
      const studentId = this.data.graduate.studentId || this.data.graduate.student?.id;
      
      this.graduateForm.patchValue({
        id: this.data.graduate.id,
        studentId: studentId?.toString() || '',
        finalGrade: this.data.graduate.finalGrade,
        completionDate: this.formatDateForInput(this.data.graduate.completionDate)
      });
    }
  }

  private initForm(): void {
    this.graduateForm = this.fb.group({
      id: [null],
      studentId: ['', Validators.required],
      finalGrade: [Grade.excellent, Validators.required],
      completionDate: ['', Validators.required]
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

  getArabicGrade(grade: string): string {
    return this.gradeMap[grade] || grade;
  }

  onSubmit(): void {
    if (this.graduateForm.valid) {
      const formValue = this.graduateForm.value;
      const formattedData = {
        ...formValue,
        completionDate: this.formatDate(formValue.completionDate)
      };
      const action = this.data.isEdit
        ? this.graduateService.updateGraduate(formattedData)
        : this.graduateService.addGraduate(formattedData);

      action.subscribe({
        next: (response: any) => {
          if (response?.successful === false) return;
          this.alertService.success('\u062a\u0645\u062a \u0627\u0644\u0639\u0645\u0644\u064a\u0629 \u0628\u0646\u062c\u0627\u062d!');
          this.dialogRef.close('success');
        },
        error: () => {
          // ErrorHandlerInterceptor handles the error toast
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
