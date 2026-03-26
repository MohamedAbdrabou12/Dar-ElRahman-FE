import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {Student} from 'src/app/models/Student.model';
import {StudentMaritalStatus} from '../../../../models/enums/StudentMaritalStatus.enum';
import {StudentService} from "../../../../services/student/student.service";
import {AlertService} from "../../../../services/alert.service";
import {LoadingService} from "../../../../services/loading.service";

@Component({
  selector: 'app-add-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './add-student-dialog.component.html',
  styleUrl: './add-student-dialog.component.scss'
})
export class AddStudentDialogComponent implements OnInit {
  studentForm!: FormGroup;
  filteredRings: any[] = [];
  profilePicPreview: string = '';
  maritalStatuses = Object.values(StudentMaritalStatus);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {student: Student | undefined, periods: any[], rings: any[]},
    private dialogRef: MatDialogRef<AddStudentDialogComponent>,
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.filteredRings = this.data.rings;
    this.buildForm();
    if (this.data.student?.ring?.periodId) {
      this.filteredRings = this.data.rings.filter(
        r => r.periodId?.toString() === this.data.student?.ring?.periodId?.toString()
      );
    }
  }

  buildForm() {
    this.studentForm = this.formBuilder.group({
      fullName: [{value: this.data.student ? this.data.student.fullName : '', disabled: false}, [Validators.required]],
      nationalId: [{value: this.data.student ? this.data.student.nationalId : '', disabled: false}, Validators.required],
      motherName: [{value: this.data.student ? this.data.student.motherName : '', disabled: false}, Validators.required],
      address: [{value: this.data.student ? this.data.student.address : '', disabled: false}, Validators.required],
      motherPhoneNumber: [{
        value: this.data.student ? this.data.student.motherPhoneNumber : '',
        disabled: false
      }, Validators.required],
      maritalStatus: [{value: this.data.student ? this.data.student.maritalStatus : '', disabled: false}, Validators.required],
      periodId: [{value: this.data.student ? this.data.student?.ring?.periodId : '', disabled: false}],
      ringId: [{value: this.data.student ? this.data.student.ringId?.toString() : '', disabled: false}, Validators.required],
      joiningDate: [{value: this.data.student ? this.data.student.joiningDate : '', disabled: false}, Validators.required],
      birthDate: [{value: this.data.student ? this.data.student.birthDate : '', disabled: false}, Validators.required],
      fatherPhoneNumber: [{
        value: this.data.student ? this.data.student.fatherPhoneNumber : '',
        disabled: false
      }, Validators.required],
      fatherEmailAddress: [{
        value: this.data.student ? this.data.student.fatherEmailAddress : '',
        disabled: false
      }, Validators.required],
      status: [{value: this.data.student ? this.data.student.status?.toLowerCase() : '', disabled: false}, Validators.required],
      gender: [{value: this.data.student ? this.data.student.gender : '', disabled: false}, Validators.required],
      profilePictureUrl: [{value: this.data.student ? this.data.student.profilePictureUrl : '', disabled: false}],
    });
    this.profilePicPreview = this.data.student?.profilePictureUrl || '';
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
    this.studentForm.markAllAsTouched();

    if (this.studentForm.valid) {
      const studentData = this.buildStudentModel();
      const action = this.data.student
        ? this.studentService.updateStudent(studentData)
        : this.studentService.addStudent(studentData);

      action.subscribe({
        next: (response) => {
          this.alertService.success('تمت العملية بنجاح!');
          this.dialogRef.close('success');
        },
        error: (error) => {
          this.alertService.error('هناك خطأ. الرجاء المحاولة مرة أخرى.');
          this.loadingService.stopLoading();
        }
      });
    }
  }

  onPeriodChange(): void {
    const periodId = this.studentForm.get('periodId')?.value;
    if (periodId) {
      this.filteredRings = this.data.rings.filter(r => r.periodId?.toString() === periodId.toString());
    } else {
      this.filteredRings = this.data.rings;
    }
    this.studentForm.patchValue({ ringId: '' });
  }

  buildStudentModel() {
    return {
      id: this.data.student?.id,
      fullName: this.studentForm.controls['fullName'].value ?? '',
      nationalId: this.studentForm.controls['nationalId'].value ?? '',
      motherName: this.studentForm.controls['motherName'].value ?? '',
      address: this.studentForm.controls['address'].value ?? '',
      motherPhoneNumber: this.studentForm.controls['motherPhoneNumber'].value ?? '',
      maritalStatus: this.studentForm.controls['maritalStatus'].value ?? '',
      ringId: this.studentForm.controls['ringId'].value ?? '',
      joiningDate: this.formatDate(this.studentForm.controls['joiningDate'].value) ?? '',
      birthDate: this.formatDate(this.studentForm.controls['birthDate'].value) ?? '',
      fatherPhoneNumber: this.studentForm.controls['fatherPhoneNumber'].value ?? '',
      fatherEmailAddress: this.studentForm.controls['fatherEmailAddress'].value ?? '',
      status: this.studentForm.controls['status'].value ?? '',
      gender: this.studentForm.controls['gender'].value ?? '',
      profilePictureUrl: this.studentForm.controls['profilePictureUrl'].value ?? '',
    }
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
      this.studentForm.patchValue({ profilePictureUrl: base64 });
    };
    reader.readAsDataURL(file);
  }

  getArabicMaritalStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      [StudentMaritalStatus.orphan]: 'يتيم',
      [StudentMaritalStatus.single_parents]: 'لديه والد',
      [StudentMaritalStatus.living_parents]: 'لديه والدان'
    };
    return statusMap[status] || status;
  }

  removeProfilePic(): void {
    this.profilePicPreview = '';
    this.studentForm.patchValue({ profilePictureUrl: '' });
  }
}
