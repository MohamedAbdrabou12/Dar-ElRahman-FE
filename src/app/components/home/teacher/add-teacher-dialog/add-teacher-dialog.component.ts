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
import { TeacherMaritalStatus } from '../../../../models/enums/TeacherMaritalStatus.enum';
import { TeacherService } from '../../../../services/teacher/teacher.service';
import { AlertService } from '../../../../services/alert.service';
import { PeriodService } from '../../../../services/period/period.service';
import { Period } from '../../../../models/Period.model';

export interface TeacherDialogData {
  isEdit: boolean;
  teacher?: any;
}

@Component({
  selector: 'app-add-teacher-dialog',
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
  templateUrl: './add-teacher-dialog.component.html',
  styleUrls: ['./add-teacher-dialog.component.scss']
})
export class AddTeacherDialogComponent implements OnInit {
  teacherForm!: FormGroup;
  maritalStatuses = Object.values(TeacherMaritalStatus);
  profilePicPreview: string = '';
  periods: Period[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddTeacherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeacherDialogData,
    private teacherService: TeacherService,
    private alertService: AlertService,
    private periodService: PeriodService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPeriods();

    if (this.data.isEdit && this.data.teacher) {
      this.teacherForm.patchValue({
        id: this.data.teacher.id,
        fullName: this.data.teacher.fullName,
        nationalId: this.data.teacher.nationalId,
        phoneNumber: this.data.teacher.phoneNumber,
        address: this.data.teacher.address,
        birthDate: this.formatDateForInput(this.data.teacher.birthDate),
        maritalStatus: this.data.teacher.maritalStatus,
        joiningDate: this.formatDateForInput(this.data.teacher.joiningDate),
        exitDate: this.formatDateForInput(this.data.teacher.exitDate),
        profession: this.data.teacher.profession,
        qualificationDate: this.formatDateForInput(this.data.teacher.qualificationDate),
        educationalQualification: this.data.teacher.educationalQualification,
        outOfWork: this.data.teacher.outOfWork,
        emailAddress: this.data.teacher.emailAddress,
        gender: this.data.teacher.gender,
        profilePictureUrl: this.data.teacher.profilePictureUrl,
        periodId: this.data.teacher.periodId
      });
      this.profilePicPreview = this.data.teacher.profilePictureUrl || '';
    }
  }

  private initForm(): void {
    this.teacherForm = this.fb.group({
      id: [null],
      fullName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      nationalId: ['', [Validators.required, Validators.pattern(AppRegexPatterns.NATIONAL_ID_PATTERN)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(AppRegexPatterns.EGP_MOBILE_PATTERN)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      birthDate: ['', Validators.required],
      maritalStatus: [TeacherMaritalStatus.single, Validators.required],
      joiningDate: ['', Validators.required],
      exitDate: [''],
      profession: [''],
      qualificationDate: [''],
      educationalQualification: [''],
      outOfWork: [false],
      emailAddress: ['', [Validators.pattern(AppRegexPatterns.EMAIL_PATTERN)]],
      gender: ['', Validators.required],
      profilePictureUrl: [''],
      periodId: [null, Validators.required]
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

  private formatYearMonth(date: Date | string | null): string | null {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private loadPeriods(): void {
    this.periodService.getAllPeriods().subscribe({
      next: (response: any) => {
        this.periods = response.data || response;
      }
    });
  }

  getArabicMaritalStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      [TeacherMaritalStatus.single]: 'أعزب',
      [TeacherMaritalStatus.married]: 'متزوج',
      [TeacherMaritalStatus.divorced]: 'مطلق',
      [TeacherMaritalStatus.widowed]: 'أرمل'
    };
    return statusMap[status] || status;
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      const formValue = this.teacherForm.value;
      const formattedData = {
        ...formValue,
        birthDate: this.formatDate(formValue.birthDate),
        joiningDate: this.formatDate(formValue.joiningDate),
        exitDate: this.formatDate(formValue.exitDate),
        qualificationDate: this.formatYearMonth(formValue.qualificationDate)
      };
      const action = this.data.isEdit
        ? this.teacherService.updateTeacher(formattedData)
        : this.teacherService.addTeacher(formattedData);

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
      this.teacherForm.patchValue({ profilePictureUrl: base64 });
    };
    reader.readAsDataURL(file);
  }

  removeProfilePic(): void {
    this.profilePicPreview = '';
    this.teacherForm.patchValue({ profilePictureUrl: '' });
  }
}
