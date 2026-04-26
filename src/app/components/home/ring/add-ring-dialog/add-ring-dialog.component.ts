import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Ring } from '../../../../models/Ring.model';
import { Teacher } from '../../../../models/Teacher.model';
import { Period } from '../../../../models/Period.model';
import { MemorizationOrder } from '../../../../models/enums/MemorizationOrder.enum';
import { MemorizationPart } from '../../../../models/enums/MemorizationPart.enum';
import { RingService } from '../../../../services/ring/ring.service';
import { AlertService } from '../../../../services/alert.service';

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
  memorizationOrders = Object.values(MemorizationOrder);

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

  private memorizationOrderMap: { [key: string]: string } = {
    [MemorizationOrder.descending]: 'تنازلي',
    [MemorizationOrder.ascending]: 'تصاعدي'
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddRingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RingDialogData,
    private ringService: RingService,
    private alertService: AlertService
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
        periodId: this.data.ring.periodId,
        memorizationPart: this.data.ring.memorizationPart,
        memorizationOrder: this.data.ring.memorizationOrder || MemorizationOrder.descending,
        teacherId: this.data.ring.teacherId?.toString() || '',
        maxExamBatch: this.data.ring.maxExamBatch || 5
      });
    }
  }

  private initForm(): void {
    this.ringForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      periodId: [null, Validators.required],
      memorizationPart: [MemorizationPart.page, Validators.required],
      memorizationOrder: [MemorizationOrder.descending, Validators.required],
      teacherId: [null, Validators.required],
      maxExamBatch: [5, [Validators.required, Validators.min(1)]]
    });
  }

  getArabicMemorizationOrder(order: string): string {
    return this.memorizationOrderMap[order] || order;
  }

  getArabicMemorizationPart(part: string): string {
    return this.memorizationPartMap[part] || part;
  }

  onSubmit(): void {
    if (this.ringForm.valid) {
      const action = this.data.isEdit
        ? this.ringService.updateRing(this.ringForm.value)
        : this.ringService.addRing(this.ringForm.value);

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
