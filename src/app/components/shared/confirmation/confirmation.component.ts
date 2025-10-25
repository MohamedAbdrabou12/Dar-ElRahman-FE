import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-confirmation',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    MatDialogClose,
    MatDialogActions
  ],
  styles: [`
    .confirm-dialog-title {
      color: #d32f2f;
      text-align: center;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .confirm-dialog-content {
      padding: 16px 0;
      text-align: center;
      font-size: 1.08rem;
    }
    .confirm-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 12px;
    }
    .confirm-dialog-cancel {
      background: #f7f8fa !important;
      color: #222 !important;
      border-radius: 8px;
      min-width: 90px;
      font-weight: 500;
    }
    .confirm-dialog-confirm {
      background: #2267d1 !important;
      color: #fff !important;
      border-radius: 8px;
      min-width: 90px;
      font-weight: 500;
    }
  `],
  template: `
    <h2 mat-dialog-title class="confirm-dialog-title">
      {{ data.title || 'تأكيد الطلب' }}
    </h2>
    <mat-dialog-content class="confirm-dialog-content">
      {{ data.message || 'هل أنت متأكد أنك تريد تنفيذ ذلك الطلب؟' }}
    </mat-dialog-content>
    <mat-dialog-actions class="confirm-dialog-actions">
      <button mat-button mat-dialog-close class="confirm-dialog-cancel">
        إلغاء
      </button>
      <button mat-raised-button color="warn" mat-dialog-close="true" class="confirm-dialog-confirm">
        حذف
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string }
  ) {}
}
