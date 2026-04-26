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
import { Tuition } from '../../../../models/Tuition.model';
import { TuitionService } from '../../../../services/tuition/tuition.service';
import { AlertService } from '../../../../services/alert.service';

export interface TuitionDialogData {
  isEdit: boolean;
  tuition?: Tuition;
  students: Student[];
}

@Component({
  selector: 'app-add-tuition-dialog',
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
  templateUrl: './add-tuition-dialog.component.html',
  styleUrls: ['./add-tuition-dialog.component.scss']
})
export class AddTuitionDialogComponent implements OnInit {
  tuitionForm!: FormGroup;
  students: Student[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddTuitionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TuitionDialogData,
    private tuitionService: TuitionService,
    private alertService: AlertService
  ) {
    this.students = data.students;
  }

  ngOnInit(): void {
    this.initForm();
    
    if (this.data.isEdit && this.data.tuition) {
      this.tuitionForm.patchValue({
        id: this.data.tuition.id,
        studentId: this.data.tuition.student?.id?.toString() || '',
        tuitionAmount: this.data.tuition.tuitionAmount,
        tuitionDate: this.formatDateForInput(this.data.tuition.tuitionDate),
        tuitionMonth: this.data.tuition.tuitionMonth || ''
      });
    }
  }

  private initForm(): void {
    this.tuitionForm = this.fb.group({
      id: [null],
      studentId: ['', Validators.required],
      tuitionAmount: [0, [Validators.required, Validators.min(0)]],
      tuitionDate: ['', Validators.required],
      tuitionMonth: ['', Validators.required]
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
    if (this.tuitionForm.valid) {
      const formValue = this.tuitionForm.value;
      const formattedData = {
        ...formValue,
        tuitionDate: this.formatDate(formValue.tuitionDate),
        tuitionMonth: formValue.tuitionMonth + '-01',
        paid: true
      };
      const action = this.data.isEdit
        ? this.tuitionService.updateTuition(formattedData)
        : this.tuitionService.addTuition(formattedData);

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
