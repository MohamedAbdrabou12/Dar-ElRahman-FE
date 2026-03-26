import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Ring } from '../../../../models/Ring.model';
import { Teacher } from '../../../../models/Teacher.model';
import { Period } from '../../../../models/Period.model';
import { MemorizationPart } from '../../../../models/enums/MemorizationPart.enum';

export interface RingDialogData {
  isEdit: boolean;
  ring?: Ring;
  teachers: Teacher[];
  periods: Period[];
}

@Component({
  selector: 'app-add-ring-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './add-ring-dialog.component.html',
  styleUrls: ['./add-ring-dialog.component.scss']
})
export class AddRingDialogComponent implements OnInit {
  ringForm!: FormGroup;
  teachers: Teacher[] = [];
  periods: Period[] = [];
  memorizationParts = Object.values(MemorizationPart);

  private memorizationPartMap: { [key: string]: string } = {
    [MemorizationPart.juz]: 'جزء',
    [MemorizationPart.half_juz]: 'نصف جزء',
    [MemorizationPart.half_hizb]: 'نصف حزب',
    [MemorizationPart.quarter_hizb]: 'ربع حزب',
    [MemorizationPart.two_pages]: 'وجهين',
    [MemorizationPart.page]: 'وجه',
    [MemorizationPart.half_page]: 'نصف وجه',
    [MemorizationPart.five_lines]: 'خمسة أسطر',
    [MemorizationPart.three_lines]: 'ثلاثة أسطر'
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddRingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RingDialogData
  ) {
    this.teachers = data.teachers;
    this.periods = data.periods;
  }

  ngOnInit(): void {
    this.initForm();

    if (this.data.isEdit && this.data.ring) {
      this.ringForm.patchValue({
        id: this.data.ring.id,
        name: this.data.ring.name,
        studentCount: this.data.ring.studentCount,
        periodId: this.data.ring.periodId,
        memorizationPart: this.data.ring.memorizationPart,
        teacherId: this.data.ring.teacherId?.toString() || ''
      });
    }
  }

  private initForm(): void {
    this.ringForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      studentCount: [0, Validators.required],
      periodId: [null, Validators.required],
      memorizationPart: [MemorizationPart.page, Validators.required],
      teacherId: [null, Validators.required]
    });
  }

  getArabicMemorizationPart(part: string): string {
    return this.memorizationPartMap[part] || part;
  }

  onSubmit(): void {
    if (this.ringForm.valid) {
      this.dialogRef.close(this.ringForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
