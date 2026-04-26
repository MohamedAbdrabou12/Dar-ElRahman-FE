import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RingService} from 'src/app/services/ring/ring.service';
import {QuestionnaireService} from 'src/app/services/questionnaire/questionnaire.service';
import {StudentService} from 'src/app/services/student/student.service';
import {StudentQuestionnaireService} from 'src/app/services/student-questionnaire/student-questionnaire.service';
import {Ring} from 'src/app/models/Ring.model';
import {Questionnaire} from 'src/app/models/Questionnaire.model';
import {Student} from 'src/app/models/Student.model';
import {Grade} from 'src/app/models/enums/Grade.enum';
import {StudentQuestionnaire} from 'src/app/models/StudentQuestionnaire.model';
import {QuestionnaireType} from "../../../models/enums/QuestionnaireType.enum";
import {MatDialog} from "@angular/material/dialog";
import {AddStudentQuestionnaireDialogComponent} from "./add-student-questionnaire-dialog/add-student-questionnaire-dialog.component";

@Component({
  selector: 'app-student-questionnaire',
  templateUrl: './student-questionnaire.component.html',
  styleUrls: ['./student-questionnaire.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class StudentQuestionnaireComponent implements OnInit {
  private dialog = inject(MatDialog);

  studentQuestionnaireForm: FormGroup;
  filterForm: FormGroup;
  rings: Ring[] = [];
  questionnaires: Questionnaire[] = [];
  questionnairesForFilter: Questionnaire[] = [];
  students: Student[] = [];
  grades: string[] = Object.values(Grade);
  studentQuestionnaires: StudentQuestionnaire[] = [];
  filteredStudentQuestionnaires: StudentQuestionnaire[] = [];
  rowSelected: any;
  buttonName = 'إضافة';
  error: any;

  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  showFilters = false;

  constructor(
    private fb: FormBuilder,
    private ringService: RingService,
    private questionnaireService: QuestionnaireService,
    private studentService: StudentService,
    private studentQuestionnaireService: StudentQuestionnaireService
  ) {
    this.studentQuestionnaireForm = this.fb.group({
      id: [null],
      ringId: ['', Validators.required],
      questionnaireId: ['', Validators.required],
      studentId: ['', Validators.required],
      grade: ['', Validators.required]
    });

    this.filterForm = this.fb.group({
      ringId: [null],
      studentName: [''],
      grade: [null],
      questionnaireId: [null],
      questionDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadRings();
    this.loadAllQuestionnairesForFilter();
    this.loadStudentQuestionnaires();
    this.filterForm.valueChanges.subscribe(() => {
      this.filterStudentQuestionnaires();
    });
  }


  loadRings(): void {
    this.ringService.getAllRings().subscribe(
      (response: any) => {
        this.rings = response.data;
      },
      (error) => {
        console.error('Rings failed', error);
      });
  }

  onRingChange(event: Event): void {
    const ringId = Number((event.target as HTMLSelectElement).value);
    if (ringId) {
      this.questionnaireService.getQuestionnairesByRingId(ringId).subscribe(
        (response: any) => {
          this.questionnaires = response.data;
          this.studentQuestionnaireForm.patchValue({questionnaireId: '', studentId: ''});
          this.students = [];
        },
        (error) => {
          console.error('Questionnaire by ringId failed', error);
        });
    } else {
      this.questionnaires = [];
      this.students = [];
    }
  }

  onQuestionnaireChange(event: Event): void {
    const questionnaireId = Number((event.target as HTMLSelectElement).value);
    if (questionnaireId) {
      this.studentService.getStudentsNotInQuestionnaire(questionnaireId).subscribe(
        (response => {
          this.students = response.data;
          this.studentQuestionnaireForm.patchValue({studentId: ''});
        }),
        (error) => {
          console.error('Students not in questionnaire failed', error);
          this.students = [];
        });
    }
  }

  loadAllQuestionnairesForFilter(): void {
    this.questionnaireService.getAllQuestionnaires().subscribe(
      (response: any) => {
        this.questionnairesForFilter = response.data;
      },
      (error) => {
        console.error('Failed to load all questionnaires for filter', error);
      }
    );
  }

  loadStudentQuestionnaires(): void {
    this.studentQuestionnaireService.getAllStudentQuestionnaires(this.pageNo, this.pageSize).subscribe(
      (response: any) => {
        this.studentQuestionnaires = response.data;
        this.totalRecords = response.totalRecords;
        this.totalPages = response.totalPages;
        this.filteredStudentQuestionnaires = response.data;
        this.filterStudentQuestionnaires();
        if (!this.rowSelected) {
          this.rowSelected = this.filteredStudentQuestionnaires[0];
        }
      },
      (error) => {
        console.error('Failed to load student questionnaires', error);
      }
    );
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
    this.loadStudentQuestionnaires();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.filterForm.reset({
      ringId: null,
      studentName: '',
      grade: null,
      questionnaireId: null,
      questionDate: ''
    });
  }

  filterStudentQuestionnaires(): void {
    const filters = this.filterForm.value;
    this.filteredStudentQuestionnaires = this.studentQuestionnaires.filter(item => {
      const ringMatch = !filters.ringId || item?.questionnaire?.ring?.id === Number(filters.ringId);
      const studentMatch = !filters.studentName || item.student?.fullName.toLowerCase().includes(filters.studentName.toLowerCase());
      const gradeMatch = !filters.grade || item.grade === filters.grade;
      const questionnaireMatch = !filters.questionnaireId || item.questionnaire?.id === Number(filters.questionnaireId);

      let dateMatch = true;
      if (filters.questionDate) {
        if (item.successDate) {
          const itemDate = new Date(item.successDate).setHours(0, 0, 0, 0);
          const filterDate = new Date(filters.questionDate).setHours(0, 0, 0, 0);
          dateMatch = itemDate === filterDate;
        } else {
          dateMatch = false;
        }
      }

      return ringMatch && studentMatch && gradeMatch && questionnaireMatch && dateMatch;
    });
  }

  onRowClick(row: any): void {
    this.rowSelected = row;
  }


  handleAddClick() {
    const dialogRef = this.dialog.open(AddStudentQuestionnaireDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: false,
        rings: this.rings,
        questionnaires: this.questionnaires,
        students: this.students
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudentQuestionnaires();
      }
    });
  }

  handleEditClick(item: StudentQuestionnaire) {
    const dialogRef = this.dialog.open(AddStudentQuestionnaireDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: true,
        studentQuestionnaire: item,
        rings: this.rings,
        questionnaires: this.questionnaires,
        students: this.students
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudentQuestionnaires();
      }
    });
  }

  handleEditClickOLD(item: StudentQuestionnaire) {
    this.buttonName = 'تعديل';
    this.error = null;

    // Pre-load questionnaires and students for the form
    const ringId = item?.questionnaire?.ring?.id;
    const questionnaireId = item.questionnaire?.id;

    if (ringId) {
      this.questionnaireService.getQuestionnairesByRingId(ringId).subscribe(response => {
        this.questionnaires = response.data;
        if (questionnaireId) {
          this.studentService.getStudentsNotInQuestionnaire(questionnaireId).subscribe(studentResponse => {
            // Add the current student to the list if they are not already there
            const currentStudentExists = studentResponse.data.some((s: Student) => s.id === item?.student?.id);
            if (!currentStudentExists) {
              this.students = [item.student, ...studentResponse.data];
            } else {
              this.students = studentResponse.data;
            }

            this.studentQuestionnaireForm.patchValue({
              id: item.id,
              ringId: ringId,
              questionnaireId: questionnaireId,
              studentId: item?.student?.id,
              grade: item.grade
            });
          });
        }
      });
    } else {
      this.studentQuestionnaireForm.patchValue({
        id: item.id,
        ringId: ringId,
        questionnaireId: questionnaireId,
        studentId: item?.student?.id,
        grade: item.grade
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.studentQuestionnaireService.deleteStudentQuestionnaire(id).subscribe({
        next: () => {
          this.loadStudentQuestionnaires();
        },
        error: (error) => {
          console.error('Failed to delete student questionnaire', error);
        }
      });
    }
  }

  private gradeMap: { [key: string]: string } = {
    [Grade.excellent]: 'ممتاز',
    [Grade.very_good]: 'جيد جدا',
    [Grade.good]: 'جيد'
  };

  getArabicGrade(grade: string | null | undefined): string {
    if (!grade)
      return '';
    return this.gradeMap[grade] || grade;
  }

  protected readonly QuestionnaireType = QuestionnaireType;
}
