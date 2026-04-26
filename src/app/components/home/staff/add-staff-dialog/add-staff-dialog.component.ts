import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRegexPatterns } from '../../../../constants/app-regex-patterns';
import { StaffType } from '../../../../models/Staff.model';
import { StaffService } from '../../../../services/staff/staff.service';
import { AlertService } from '../../../../services/alert.service';

export interface StaffDialogData {
  isEdit: boolean;
  staff?: any;
}

@Component({
  selector: 'app-add-staff-dialog',
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
  templateUrl: './add-staff-dialog.component.html',
  styleUrls: ['./add-staff-dialog.component.scss']
})
export class AddStaffDialogComponent implements OnInit {
  staffForm!: FormGroup;
  staffTypes = Object.values(StaffType);
  profilePicPreview: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddStaffDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StaffDialogData,
    private staffService: StaffService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.data.isEdit && this.data.staff) {
      this.staffForm.patchValue({
        id: this.data.staff.id,
        fullName: this.data.staff.fullName,
        nationalId: this.data.staff.nationalId,
        phoneNumber: this.data.staff.phoneNumber,
        address: this.data.staff.address,
        birthDate: this.formatDateForInput(this.data.staff.birthDate),
        staffType: this.data.staff.staffType,
        joiningDate: this.formatDateForInput(this.data.staff.joiningDate),
        emailAddress: this.data.staff.emailAddress,
        gender: this.data.staff.gender,
        profilePictureUrl: this.data.staff.profilePictureUrl,
        outOfWork: this.data.staff.outOfWork || false,
        exitDate: this.formatDateForInput(this.data.staff.exitDate)
      });
      this.profilePicPreview = this.data.staff.profilePictureUrl || '';
    }
  }

  private initForm(): void {
    this.staffForm = this.fb.group({
      id: [null],
      fullName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      nationalId: ['', [Validators.required, Validators.pattern(AppRegexPatterns.NATIONAL_ID_PATTERN)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(AppRegexPatterns.EGP_MOBILE_PATTERN)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      birthDate: ['', Validators.required],
      staffType: [StaffType.TECHNICAL, Validators.required],
      joiningDate: ['', Validators.required],
      emailAddress: ['', [Validators.pattern(AppRegexPatterns.EMAIL_PATTERN)]],
      gender: ['', Validators.required],
      profilePictureUrl: [''],
      outOfWork: [false],
      exitDate: ['']
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

  getArabicStaffType(type: string): string {
    const typeMap: { [key: string]: string } = {
      [StaffType.TECHNICAL]: 'فني',
      [StaffType.SUPERVISOR]: 'مشرف',
    };
    return typeMap[type] || type;
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      const formValue = this.staffForm.value;
      const formattedData = {
        ...formValue,
        birthDate: this.formatDate(formValue.birthDate),
        joiningDate: this.formatDate(formValue.joiningDate),
        exitDate: formValue.exitDate ? this.formatDate(formValue.exitDate) : null,
      };
      const action = this.data.isEdit
        ? this.staffService.updateStaff(formattedData)
        : this.staffService.createStaff(formattedData);

      action.subscribe({
        next: (response: any) => {
          if (response?.successful === false) return;
          this.alertService.success('تمت العملية بنجاح!');
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

  onProfilePicSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.size > 500 * 1024) {
      alert('\u062d\u062c\u0645 \u0627\u0644\u0635\u0648\u0631\u0629 \u064a\u062c\u0628 \u0623\u0646 \u064a\u0643\u0648\u0646 \u0623\u0642\u0644 \u0645\u0646 500 \u0643\u064a\u0644\u0648\u0628\u0627\u064a\u062a');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.profilePicPreview = base64;
      this.staffForm.patchValue({ profilePictureUrl: base64 });
    };
    reader.readAsDataURL(file);
  }

  removeProfilePic(): void {
    this.profilePicPreview = '';
    this.staffForm.patchValue({ profilePictureUrl: '' });
  }
}
