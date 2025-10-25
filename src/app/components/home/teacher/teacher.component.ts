import {CommonModule, NgClass} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {TeacherService} from 'src/app/services/teacher/teacher.service';
import {AppRegexPatterns} from 'src/app/constants/app-regex-patterns';
import {Modal} from 'bootstrap';
import {TeacherMaritalStatus} from "../../../models/enums/TeacherMaritalStatus.enum";

@Component({
  selector: 'app-teacher',
  imports: [NgClass, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss',
})
export class TeacherComponent implements OnInit {
  @ViewChild('teachertModal') teacherModal!: ElementRef; // Reference to the modal
  private modalInstance: Modal | null = null;

  data: any[] = [];
  rowSelected: any;
  buttonName = 'إضافة';
  teacher = {
    id: null,
    fullName: '',
    nationalId: '',
    phoneNumber: '',
    address: '',
    birthDate: '',
    maritalStatus: 'غير معروف',
    joiningDate: '',
    exitDate: '',
    profession: '',
    qualificationDate: '',
    educationalQualification: '',
    outOfWork: '',
    emailAddress: '',
  };
  error: any;
  deleteError: any;

  teacherForm: FormGroup | undefined;

  constructor(
    private teacherService: TeacherService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getAllTeachers();
    this.buildTeacherForm();
  }

  private getAllTeachers() {
    this.teacherService.getAllTeachers().subscribe(
      (response: any) => {
        console.log('Teacher response', response);
        this.data = response.data;
        this.rowSelected = this.data[0];
      },
      (error) => {
        console.error('Teacher failed', error);
      }
    );
  }

  buildTeacherForm() {
    this.teacherForm = this.fb.group({
      id: [null],
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      nationalId: [
        '',
        [Validators.pattern(AppRegexPatterns.NATIONAL_ID_PATTERN)],
      ],
      phoneNumber: [
        '',
        [Validators.pattern(AppRegexPatterns.EGP_MOBILE_PATTERN)],
      ],
      emailAddress: ['', [Validators.pattern(AppRegexPatterns.EMAIL_PATTERN)]],
      address: [''],
      birthDate: [''],
      maritalStatus: [''],
      profession: [''],
      educationalQualification: [''],
      qualificationDate: [''],
      joiningDate: [''],
      outOfWork: [false],
      exitDate: [''],
      deleted: [false],
    });
  }

  selectRow(row: any) {
    this.rowSelected = row;
  }

  onSubmit() {
    if (this.buttonName === 'إضافة') {
      this.teacherService.addTeacher(this.teacherForm?.value).subscribe(
        (response) => {
          this.getAllTeachers();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    } else {
      console.log('Edit Request', this.teacherForm?.value);

      this.teacherService.updateTeacher(this.teacherForm?.value).subscribe(
        (response) => {
          this.getAllTeachers();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    }
  }

  reset() {
    this.teacher = {
      id: null,
      fullName: '',
      nationalId: '',
      phoneNumber: '',
      address: '',
      birthDate: '',
      maritalStatus: 'غير معروف',
      joiningDate: '',
      exitDate: '',
      profession: '',
      educationalQualification: '',
      qualificationDate: '',
      outOfWork: '',
      emailAddress: '',
    };
  }

  handleAddClick() {
    this.buildTeacherForm();
  }

  editTeacher(student: any) {
    this.teacher = this.cloneTeacher(student);
    this.teacherForm?.patchValue({
      id: this.teacher.id,
      fullName: this.teacher.fullName,
      nationalId: this.teacher.nationalId,
      phoneNumber: this.teacher.phoneNumber,
      emailAddress: this.teacher.emailAddress,
      address: this.teacher.address,
      birthDate: this.teacher.birthDate,
      maritalStatus: this.teacher.maritalStatus,
      profession: this.teacher.profession,
      educationalQualification: this.teacher.educationalQualification,
      qualificationDate: this.teacher.qualificationDate,
      joiningDate: this.teacher.joiningDate,
      outOfWork: this.teacher.outOfWork,
      exitDate: this.teacher.exitDate,
    });
    this.buttonName = 'تعديل';
  }

  deleteTeacher(teacher: any) {
    this.teacherService.deleteTeacher(teacher.id).subscribe(
      (data) => {
        this.data = this.data.filter((teachr) => teachr.id !== teacher.id);
        this.deleteError = null;
      },
      (error) => {
        console.log(error);

        this.deleteError = error;
      }
    );
  }

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.teacherModal.nativeElement);
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      // Manually remove the backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    } else {
      console.error('Modal instance is not initialized.');
    }
  }

  cloneTeacher(teacher: any): any {
    return {
      id: teacher.id,
      fullName: teacher.fullName,
      nationalId: teacher.nationalId,
      phoneNumber: teacher.phoneNumber,
      address: teacher.address,
      birthDate: teacher.birthDate,
      maritalStatus: teacher.maritalStatus,
      workingDate: teacher.workingDate,
      exitDate: teacher.exitDate,
      profession: teacher.profession,
      qualificationDate: teacher.qualificationDate,
      educationalQualification: teacher.educationalQualification,
      outOfWork: teacher.outOfWork,
      emailAddress: teacher.emailAddress,
    };
  }

  private statusMap: { [key: string]: string } = {
    [TeacherMaritalStatus.not_defined]: 'غير معروف',
    [TeacherMaritalStatus.single]: 'أعزب',
    [TeacherMaritalStatus.married]: 'متزوج',
    [TeacherMaritalStatus.divorced]: 'مطلق'
  };

  getArabicStatus(status: string | null | undefined): string {
    if (!status)
      return '';
    return this.statusMap[status] || status;
  }


}
