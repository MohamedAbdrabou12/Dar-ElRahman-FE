import {Component, inject, Inject, Input, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {Student} from 'src/app/models/Student.model';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter
} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {StudentService} from "../../../../services/student/student.service";
import {AlertService} from "../../../../services/alert.service";
import {LoadingService} from "../../../../services/loading.service";

@Component({
  selector: 'app-add-student-dialog',
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './add-student-dialog.component.html',
  styleUrl: './add-student-dialog.component.scss',
  providers: [
    {provide: DateAdapter, useClass: NativeDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}
  ]
})
export class AddStudentDialogComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<AddStudentDialogComponent>);
  studentForm!: FormGroup;
  @Input() student: Student | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {student: Student | undefined, periods: any[], rings: any[]},
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
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
      periodName: [{value: this.data.student ? this.data.student.periodName : '', disabled: false}, Validators.required],
      ringId: [{value: this.data.student ? this.data.student.ringId : '', disabled: false}, Validators.required],
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
      status: [{value: this.data.student ? this.data.student.status : '', disabled: false}, Validators.required],
    });
  }

  onSubmit() {
    this.studentForm.markAllAsTouched();
    console.log(this.studentForm.valid, this.studentForm.value);
    if(this.studentForm.valid){
      this.studentService.addStudent(this.buildStudentModel()).subscribe(
        (response) => {
          this.alertService.success('تمت العملية بنجاح!');
          this.dialogRef.close('success');
        },
        (error) => {
          this.alertService.error('هناك خطأ. الرجاء المحاولة مرة أخرى.');
          this.loadingService.stopLoading();
        }
      );
    }
  }

  buildStudentModel() {
    return {
      fullName: this.studentForm.controls['fullName'].value ?? '',
      nationalId: this.studentForm.controls['nationalId'].value ?? '',
      motherName: this.studentForm.controls['motherName'].value ?? '',
      address: this.studentForm.controls['address'].value ?? '',
      motherPhoneNumber: this.studentForm.controls['motherPhoneNumber'].value ?? '',
      maritalStatus: this.studentForm.controls['maritalStatus'].value ?? '',
      periodName: this.studentForm.controls['periodName'].value ?? '',
      ringId: this.studentForm.controls['ringId'].value ?? '',
      joiningDate: this.studentForm.controls['joiningDate'].value ?? '',
      birthDate: this.studentForm.controls['birthDate'].value ?? '',
      fatherPhoneNumber: this.studentForm.controls['fatherPhoneNumber'].value ?? '',
      fatherEmailAddress: this.studentForm.controls['fatherEmailAddress'].value ?? '',
      status: this.studentForm.controls['status'].value ?? '',
    }
  }
}
