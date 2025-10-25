import {CommonModule} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {Modal} from 'bootstrap';
import {TeacherResultService} from "../../../services/teacher-result/teacher-result.service";
import {TeacherResult} from "../../../models/TeacherResult.model";
import {Teacher} from "../../../models/Teacher.model";
import {TeacherService} from "../../../services/teacher/teacher.service";

@Component({
  selector: 'app-teacher',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-result.component.html',
  styleUrl: './teacher-result.component.scss',
})
export class TeacherResultComponent implements OnInit {
  @ViewChild('teacherResultModal') teacherResultModal!: ElementRef; // Reference to the modal
  private modalInstance: Modal | null = null;

  data: TeacherResult[] = [];
  rowSelected?: TeacherResult;
  teachers: Teacher[] = [];
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
    teacher: ''
  };
  error: any;
  deleteError: any;

  teacherResultForm: FormGroup | undefined;

  constructor(
    private teacherService: TeacherService,
    private teacherResultService: TeacherResultService,
    private fb: FormBuilder
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
    this.teacherResultService.getAllTeacherResults().subscribe(
      (response: any) => {
        console.log('Teacher result response', response);
        this.data = response.data;
        this.rowSelected = this.data[0];
      },
      (error) => {
        console.error('Teacher result failed', error);
      }
    );
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

  onSubmit() {
    if (this.buttonName === 'إضافة') {
      this.teacherResultService.addTeacherResult(this.teacherResultForm?.value).subscribe(
        (response) => {
          this.getAllTeacherResults();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    } else {
      console.log('Edit Request', this.teacherResultForm?.value);

      this.teacherResultService.updateTeacherResult(this.teacherResultForm?.value).subscribe(
        (response) => {
          this.getAllTeacherResults();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    }
  }

  reset() {
    this.teacherResult = {
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
      teacher: ''
    };
  }

  handleAddClick() {
    this.buildTeacherResultForm();
  }

  editTeacherResult(teacherResult1: TeacherResult) {
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

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.teacherResultModal.nativeElement);
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
      teacher: teacherResult.teacher,
    };
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
