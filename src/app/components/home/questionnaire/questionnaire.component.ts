import {CommonModule} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Modal} from 'bootstrap';
import {Questionnaire} from 'src/app/models/Questionnaire.model';
import {Ring} from 'src/app/models/Ring.model';
import {Surah} from 'src/app/models/Surah.model';
import {QuestionnaireService} from 'src/app/services/questionnaire/questionnaire.service';
import {RingService} from 'src/app/services/ring/ring.service';
import {SurahsService} from 'src/app/services/surahs/surahs.service';
import {QuestionnaireType} from "../../../models/enums/QuestionnaireType.enum";
import {QuestionType} from "../../../models/enums/QuestionType.enum.js";

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class QuestionnaireComponent implements OnInit {
  @ViewChild('questionnaireModal') questionnaireModal!: ElementRef;
  private modalInstance: Modal | null = null;

  data: Questionnaire[] = [];
  rings: Ring[] = [];
  surahs: Surah[] = [];
  rowSelected: Questionnaire | undefined;
  buttonName = 'إضافة';
  questionnaire: Questionnaire = {
    questionnaireType: QuestionnaireType.memorization,
    questionType: QuestionType.first,
    questionDate: new Date(),
    currentSurah: undefined,
    ring: undefined
  };
  error: any;
  deleteError: any;

  questionnaireForm: FormGroup | undefined;

  constructor(
    private questionnaireService: QuestionnaireService,
    private ringService: RingService,
    private surahService: SurahsService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getAllQuestionnaires();
    this.getAllRings();
    this.getAllSurahs();
    this.buildQuestionnaireForm();
  }

  private getAllQuestionnaires() {
    this.questionnaireService.getAllQuestionnaires().subscribe(
      (response: any) => {
        this.data = response.data;
        this.rowSelected = this.data[0];
      },
      (error) => {
        console.error('Questionnaires fetch failed', error);
      }
    );
  }

  private getAllRings() {
    this.ringService.getAllRings().subscribe(
      (response: any) => {
        this.rings = response.data;
      },
      (error) => {
        console.error('Rings fetch failed', error);
      }
    );
  }

  private getAllSurahs() {
    this.surahService.getAllSurahs().subscribe(
      (response: any) => {
        this.surahs = response.data;
      },
      (error) => {
        console.error('Surahs fetch failed', error);
      }
    );
  }

  buildQuestionnaireForm() {
    this.questionnaireForm = this.fb.group({
      id: [null],
      questionnaireType: [QuestionnaireType.memorization, Validators.required],
      questionType: [QuestionType.first, Validators.required],
      questionDate: [new Date(), Validators.required],
      currentSurah: [null, Validators.required],
      ring: [null, Validators.required],
    });
  }

  selectRow(row: any) {
    this.rowSelected = row;
  }

  onSubmit() {
    if (this.buttonName === 'إضافة') {
      this.questionnaireService.addQuestionnaire(this.questionnaireForm?.value).subscribe(
        (response) => {
          this.getAllQuestionnaires();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    } else {
      this.questionnaireService.updateQuestionnaire(this.questionnaireForm?.value).subscribe(
        (response) => {
          this.getAllQuestionnaires();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    }
  }

  reset() {
    this.questionnaire = {
      questionnaireType: QuestionnaireType.memorization,
      questionType: QuestionType.first,
      questionDate: new Date(),
      currentSurah: undefined,
      ring: undefined
    };
    this.buttonName = 'إضافة';
  }

  handleAddClick() {
    this.reset();
    this.buildQuestionnaireForm();
  }

  editQuestionnaire(questionnaire: Questionnaire) {
    this.questionnaire = {...questionnaire};
    this.questionnaireForm?.patchValue({
      id: this.questionnaire.id,
      questionnaireType: this.questionnaire.questionnaireType,
      questionType: this.questionnaire.questionType,
      questionDate: this.questionnaire.questionDate,
      currentSurah: this.questionnaire.currentSurah,
      ring: this.questionnaire.ring,
    });
    this.buttonName = 'تعديل';
  }

  deleteQuestionnaire(questionnaire: Questionnaire) {
    this.questionnaireService.deleteQuestionnaire(questionnaire.id!).subscribe(
      (data) => {
        this.data = this.data.filter((q) => q.id !== questionnaire.id);
        this.deleteError = null;
        if (this.rowSelected?.id === questionnaire.id) {
          this.rowSelected = undefined;
        }
      },
      (error) => {
        this.deleteError = error;
      }
    );
  }

  markStudentQuestionnaireAsDone(questionnaire: Questionnaire): void {
    if (confirm('Are you sure you want to mark this questionnaire as done?')) {
      this.questionnaireService.markStudentQuestionnaireAsDone(questionnaire).subscribe({
        next: () => {
          this.getAllQuestionnaires();
        },
        error: (error) => {
          console.error('Failed to mark questionnaire as done', error);
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.questionnaireModal) {
      this.modalInstance = new Modal(this.questionnaireModal.nativeElement);
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }

  protected readonly QuestionnaireType = QuestionnaireType;
  protected readonly QuestionType = QuestionType;

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
