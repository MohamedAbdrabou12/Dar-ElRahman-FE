import {CommonModule, NgClass} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {TeacherService} from 'src/app/services/teacher/teacher.service';
import {AppRegexPatterns} from 'src/app/constants/app-regex-patterns';
import {TeacherMaritalStatus} from "../../../models/enums/TeacherMaritalStatus.enum";
import {MatDialog} from "@angular/material/dialog";
import {AddTeacherDialogComponent} from "./add-teacher-dialog/add-teacher-dialog.component";
import {normalizeArabic} from '../../../utils/arabic-normalizer';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-teacher',
  imports: [NgClass, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss',
})
export class TeacherComponent implements OnInit {
  private dialog = inject(MatDialog);

  data: any[] = [];
  filteredData: any[] = [];
  rowSelected: any;
  today = new Date();

  searchTerm = '';
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  buttonName = 'إضافة';
  teacher = {
    id: null,
    fullName: '',
    nationalId: '',
    phoneNumber: '',
    address: '',
    birthDate: '',
    maritalStatus: 'أعزب',
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
    private fb: FormBuilder,
    protected authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getAllTeachers();
    this.buildTeacherForm();
  }

  private getAllTeachers() {
    this.teacherService.getAllTeachers(this.pageNo, this.pageSize).subscribe(
      (response: any) => {
        this.data = response.data;
        this.totalRecords = response.totalRecords ?? response.data?.length ?? 0;
        this.totalPages = Math.max(response.totalPages ?? 0, Math.ceil(this.totalRecords / this.pageSize));
        this.applySearch();
        if (!this.rowSelected) {
          this.rowSelected = this.filteredData[0];
        }
      },
      (error) => {
        console.error('Teacher failed', error);
      }
    );
  }

  applySearch() {
    if (!this.searchTerm.trim()) {
      this.filteredData = this.data;
      return;
    }
    const term = normalizeArabic(this.searchTerm.toLowerCase());
    this.filteredData = this.data.filter((row: any) =>
      normalizeArabic(row.fullName)?.toLowerCase().includes(term) ||
      normalizeArabic(row.nationalId)?.toLowerCase().includes(term) ||
      row.id?.toString().includes(term) ||
      row.phoneNumber?.toLowerCase().includes(term)
    );
  }

  onSearchChange() {
    this.applySearch();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
    this.getAllTeachers();
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


  handleAddClick() {
    const dialogRef = this.dialog.open(AddTeacherDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllTeachers();
      }
    });
  }

  editTeacher(teacher: any) {
    const dialogRef = this.dialog.open(AddTeacherDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: true,
        teacher: teacher
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllTeachers();
      }
    });
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

  printEntity() {
    window.print();
  }

  private statusMap: { [key: string]: string } = {
    [TeacherMaritalStatus.single]: 'أعزب',
    [TeacherMaritalStatus.married]: 'متزوج',
    [TeacherMaritalStatus.divorced]: 'مطلق'
  };

  getArabicStatus(status: string | null | undefined): string {
    if (!status)
      return '';
    return this.statusMap[status] || status;
  }

  getArabicGender(gender: string | null | undefined): string {
    if (!gender) return '';
    const map: { [key: string]: string } = { 'MALE': 'ذكر', 'FEMALE': 'أنثى' };
    return map[gender] || gender;
  }
}
