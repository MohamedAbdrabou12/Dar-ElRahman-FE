import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {TeacherResultService} from "../../../services/teacher-result/teacher-result.service";
import {TeacherResult} from "../../../models/TeacherResult.model";
import {Teacher} from "../../../models/Teacher.model";
import {TeacherService} from "../../../services/teacher/teacher.service";
import {MatDialog} from "@angular/material/dialog";
import {AddTeacherResultDialogComponent} from "./add-teacher-result-dialog/add-teacher-result-dialog.component";
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-teacher',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-result.component.html',
  styleUrl: './teacher-result.component.scss',
})
export class TeacherResultComponent implements OnInit {
  private dialog = inject(MatDialog);

  data: TeacherResult[] = [];
  filteredData: TeacherResult[] = [];
  rowSelected?: TeacherResult;
  teachers: Teacher[] = [];
  today = new Date();

  searchTerm = '';
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  buttonName = 'إضافة';
  teacherResult = {
    id: null,
    resultDate: '',
    resultCalculationDate: '',
    memorizationCount: '',
    memorizationSuccessCount: '',
    memorizationStudentCount: '',
    revisionCount: '',
    revisionSuccessCount: '',
    revisionStudentCount: '',
    firstQuestionSuccessCount: '',
    secondQuestionSuccessCount: '',
    thirdQuestionSuccessCount: '',
    memorizationPercentage: '',
    revisionPercentage: '',
    adjustmentValue: '',
    successPercentage: '',
    averageAttempts: '',
    excellentRate: '',
    absentRate: '',
    pointsEarned: '',
    maxPossiblePoints: '',
    memorizationWeight: '',
    revisionWeight: '',
    teacher: ''
  };
  error: any;
  deleteError: any;

  teacherResultForm: FormGroup | undefined;

  constructor(
    private teacherService: TeacherService,
    private teacherResultService: TeacherResultService,
    private fb: FormBuilder,
    protected authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getAllTeachers();
    this.getAllTeacherResults();
    this.buildTeacherResultForm();
  }

  private getAllTeachers() {
    this.teacherService.getAllTeachers().subscribe(
      (response: any) => {
        console.log('Teacher response', response);
        this.teachers = response.data;
      },
      (error) => {
        console.error('Teacher failed', error);
      }
    );
  }

  private getAllTeacherResults() {
    this.teacherResultService.getAllTeacherResults(this.pageNo, this.pageSize).subscribe(
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
        console.error('Teacher result failed', error);
      }
    );
  }

  applySearch() {
    if (!this.searchTerm.trim()) {
      this.filteredData = this.data;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter((row: any) =>
      row.teacher?.fullName?.toLowerCase().includes(term) ||
      row.teacher?.nationalId?.toLowerCase().includes(term) ||
      row.id?.toString().includes(term)
    );
  }

  onSearchChange() {
    this.applySearch();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
    this.getAllTeacherResults();
  }

  buildTeacherResultForm() {
    this.teacherResultForm = this.fb.group({
      id: [null],
      resultDate: [''],
      resultCalculationDate: [''],
      memorizationCount: [''],
      memorizationSuccessCount: [''],
      memorizationStudentCount: [''],
      revisionCount: [''],
      revisionSuccessCount: [''],
      revisionStudentCount: [''],
      firstQuestionSuccessCount: [''],
      secondQuestionSuccessCount: [''],
      thirdQuestionSuccessCount: [''],
      memorizationPercentage: [''],
      revisionPercentage: [''],
      adjustmentValue: [''],
      successPercentage: [''],
      teacher: [''],
    });
  }

  selectRow(row: TeacherResult) {
    this.rowSelected = row;
  }


  handleAddClick() {
    const dialogRef = this.dialog.open(AddTeacherResultDialogComponent, {
      width: '1100px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: false,
        teachers: this.teachers
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllTeacherResults();
      }
    });
  }

  editTeacherResult(teacherResult: TeacherResult) {
    const dialogRef = this.dialog.open(AddTeacherResultDialogComponent, {
      width: '1100px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: true,
        teacherResult: teacherResult,
        teachers: this.teachers
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllTeacherResults();
      }
    });
  }

  editTeacherResultOLD(teacherResult1: TeacherResult) {
    this.teacherResult = this.cloneTeacherResult(teacherResult1);
    this.teacherResultForm?.patchValue({
      id: this.teacherResult.id,
      resultDate: this.teacherResult.resultDate,
      resultCalculationDate: this.teacherResult.resultCalculationDate,
      memorizationCount: this.teacherResult.memorizationCount,
      memorizationSuccessCount: this.teacherResult.memorizationSuccessCount,
      memorizationStudentCount: this.teacherResult.memorizationStudentCount,
      revisionCount: this.teacherResult.revisionCount,
      revisionSuccessCount: this.teacherResult.revisionSuccessCount,
      revisionStudentCount: this.teacherResult.revisionStudentCount,
      firstQuestionSuccessCount: this.teacherResult.firstQuestionSuccessCount,
      secondQuestionSuccessCount: this.teacherResult.secondQuestionSuccessCount,
      thirdQuestionSuccessCount: this.teacherResult.thirdQuestionSuccessCount,
      memorizationPercentage: this.teacherResult.memorizationPercentage,
      revisionPercentage: this.teacherResult.revisionPercentage,
      adjustmentValue: this.teacherResult.adjustmentValue,
      successPercentage: this.teacherResult.successPercentage,
      teacher: this.teacherResult.teacher,
    });
    this.buttonName = 'تعديل';
  }

  deleteTeacherResult(teacherResult: any) {
    this.teacherResultService.deleteTeacherResult(teacherResult.id).subscribe(
      (data) => {
        this.data = this.data.filter((result) => result.id !== teacherResult.id);
        this.deleteError = null;
      },
      (error) => {
        console.log(error);

        this.deleteError = error;
      }
    );
  }


  cloneTeacherResult(teacherResult: any): any {
    return {
      id: teacherResult.id,
      resultDate: teacherResult.resultDate,
      resultCalculationDate: teacherResult.resultCalculationDate,
      memorizationCount: teacherResult.memorizationCount,
      memorizationSuccessCount: teacherResult.memorizationSuccessCount,
      memorizationStudentCount: teacherResult.memorizationStudentCount,
      revisionCount: teacherResult.revisionCount,
      revisionSuccessCount: teacherResult.revisionSuccessCount,
      revisionStudentCount: teacherResult.revisionStudentCount,
      firstQuestionSuccessCount: teacherResult.firstQuestionSuccessCount,
      secondQuestionSuccessCount: teacherResult.secondQuestionSuccessCount,
      thirdQuestionSuccessCount: teacherResult.thirdQuestionSuccessCount,
      memorizationPercentage: teacherResult.memorizationPercentage,
      revisionPercentage: teacherResult.revisionPercentage,
      adjustmentValue: teacherResult.adjustmentValue,
      successPercentage: teacherResult.successPercentage,
      averageAttempts: teacherResult.averageAttempts,
      excellentRate: teacherResult.excellentRate,
      absentRate: teacherResult.absentRate,
      pointsEarned: teacherResult.pointsEarned,
      maxPossiblePoints: teacherResult.maxPossiblePoints,
      memorizationWeight: teacherResult.memorizationWeight,
      revisionWeight: teacherResult.revisionWeight,
      teacher: teacherResult.teacher,
    };
  }

  printEntity() {
    window.print();
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
