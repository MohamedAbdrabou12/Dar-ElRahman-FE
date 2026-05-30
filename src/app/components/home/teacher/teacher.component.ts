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
import {PeriodService} from '../../../services/period/period.service';
import {Period} from '../../../models/Period.model';

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

  filterForm!: FormGroup;
  showFilters = false;
  periods: Period[] = [];
  maritalStatuses = Object.values(TeacherMaritalStatus);
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
    private periodService: PeriodService,
    protected authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      teacherName: [''],
      outOfWork: [null],
      periodName: [null],
      maritalStatus: [null]
    });
    this.getAllTeachers();
    this.buildTeacherForm();
    this.loadPeriods();
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private getAllTeachers() {
    this.teacherService.getAllTeachers(0, 10000).subscribe(
      (response: any) => {
        this.data = response.data;
        this.applyFilters();
        if (!this.rowSelected) {
          this.rowSelected = this.filteredData[0];
        }
      },
      (error) => {
        console.error('Teacher failed', error);
      }
    );
  }

  private loadPeriods(): void {
    this.periodService.getAllPeriods().subscribe(
      (response: any) => { this.periods = response.data; },
      (error) => { console.error('Periods fetch failed', error); }
    );
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.filterForm.reset({
      teacherName: '',
      outOfWork: null,
      periodName: null,
      maritalStatus: null
    });
  }

  applyFilters() {
    const filters = this.filterForm?.value;
    if (!filters) {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter((row: any) => {
        const nameMatch = !filters.teacherName || normalizeArabic(row.fullName)?.toLowerCase().includes(normalizeArabic(filters.teacherName.toLowerCase())) || normalizeArabic(row.nationalId)?.toLowerCase().includes(normalizeArabic(filters.teacherName.toLowerCase())) || row.phoneNumber?.toLowerCase().includes(filters.teacherName.toLowerCase());
        const outOfWorkMatch = filters.outOfWork === null || filters.outOfWork === '' || row.outOfWork === (filters.outOfWork === 'true');
        const periodMatch = !filters.periodName || row.periodName === filters.periodName;
        const statusMatch = !filters.maritalStatus || row.maritalStatus === filters.maritalStatus;
        return nameMatch && outOfWorkMatch && periodMatch && statusMatch;
      });
    }
    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.pageNo >= this.totalPages) this.pageNo = 0;
  }

  get paginatedData() {
    const start = this.pageNo * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
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
