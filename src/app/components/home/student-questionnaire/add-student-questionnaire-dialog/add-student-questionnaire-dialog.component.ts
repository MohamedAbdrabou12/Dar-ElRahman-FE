import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Ring } from '../../../../models/Ring.model';
import { Questionnaire } from '../../../../models/Questionnaire.model';
import { Student } from '../../../../models/Student.model';
import { Grade } from '../../../../models/enums/Grade.enum';
import { StudentQuestionnaire } from '../../../../models/StudentQuestionnaire.model';
import { QuestionnaireService } from '../../../../services/questionnaire/questionnaire.service';
import { StudentService } from '../../../../services/student/student.service';
import { StudentQuestionnaireService } from '../../../../services/student-questionnaire/student-questionnaire.service';
import { AlertService } from '../../../../services/alert.service';

export interface StudentQuestionnaireDialogData {
  isEdit: boolean;
  studentQuestionnaire?: StudentQuestionnaire;
  rings: Ring[];
  questionnaires: Questionnaire[];
  students: Student[];
}

@Component({
  selector: 'app-add-student-questionnaire-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './add-student-questionnaire-dialog.component.html',
  styleUrls: ['./add-student-questionnaire-dialog.component.scss']
})
export class AddStudentQuestionnaireDialogComponent implements OnInit {
  studentQuestionnaireForm!: FormGroup;
  rings: Ring[] = [];
  allQuestionnaires: Questionnaire[] = [];
  questionnaires: Questionnaire[] = [];
  allStudents: Student[] = [];
  students: Student[] = [];
  grades = Object.values(Grade);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddStudentQuestionnaireDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentQuestionnaireDialogData,
    private questionnaireService: QuestionnaireService,
    private studentService: StudentService,
    private studentQuestionnaireService: StudentQuestionnaireService,
    private alertService: AlertService
  ) {
    this.rings = data.rings;
  }

  ngOnInit(): void {
    this.initForm();

    if (this.data.isEdit && this.data.studentQuestionnaire) {
      const sq = this.data.studentQuestionnaire;
      const ringId = sq?.questionnaire?.ringId;
      const questionnaireId = sq.questionnaireId;

      this.studentQuestionnaireForm.patchValue({
        id: sq.id,
        ringId: ringId?.toString() || '',
        questionnaireId: questionnaireId?.toString() || '',
        studentId: sq.studentId?.toString() || '',
        grade: sq.grade
      });

      // Load questionnaires and students via API for edit mode
      if (ringId) {
        this.questionnaireService.getQuestionnairesByRingId(ringId).subscribe({
          next: (response: any) => {
            this.questionnaires = response.data || response;
          },
          error: (err) => console.error('Failed to load questionnaires by ring', err)
        });
      }
      if (questionnaireId) {
        this.studentService.getStudentsNotInQuestionnaire(questionnaireId).subscribe({
          next: (response: any) => {
            const loadedStudents: Student[] = response.data || response;
            // Include the current student in the list if not already present
            const currentStudent = sq.student;
            if (currentStudent && !loadedStudents.some(s => s.id === currentStudent.id)) {
              this.students = [currentStudent, ...loadedStudents];
            } else {
              this.students = loadedStudents;
            }
          },
          error: (err) => console.error('Failed to load students for questionnaire', err)
        });
      }
    }
  }

  private initForm(): void {
    this.studentQuestionnaireForm = this.fb.group({
      id: [null],
      ringId: ['', Validators.required],
      questionnaireId: ['', Validators.required],
      studentId: ['', Validators.required],
      grade: ['', Validators.required]
    });
  }

  getArabicGrade(grade: string): string {
    const gradeMap: { [key: string]: string } = {
      [Grade.excellent]: 'ممتاز',
      [Grade.very_good]: 'جيد جدا',
      [Grade.good]: 'جيد'
    };
    return gradeMap[grade] || grade;
  }

  onSubmit(): void {
    if (this.studentQuestionnaireForm.valid) {
      const action = this.data.isEdit
        ? this.studentQuestionnaireService.updateStudentQuestionnaire(this.studentQuestionnaireForm.value)
        : this.studentQuestionnaireService.addStudentQuestionnaire(this.studentQuestionnaireForm.value);

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

  onRingChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const ringId = Number(selectElement.value);

    this.studentQuestionnaireForm.patchValue({
      questionnaireId: '',
      studentId: ''
    });
    this.questionnaires = [];
    this.students = [];

    if (ringId) {
      this.questionnaireService.getQuestionnairesByRingId(ringId).subscribe({
        next: (response: any) => {
          this.questionnaires = response.data || response;
        },
        error: (err) => console.error('Failed to load questionnaires by ring', err)
      });
    }
  }

  onQuestionnaireChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const questionnaireId = Number(selectElement.value);

    this.studentQuestionnaireForm.patchValue({
      studentId: ''
    });
    this.students = [];

    if (questionnaireId) {
      this.studentService.getStudentsNotInQuestionnaire(questionnaireId).subscribe({
        next: (response: any) => {
          this.students = response.data || response;
        },
        error: (err) => console.error('Failed to load students for questionnaire', err)
      });
    }
  }
}
