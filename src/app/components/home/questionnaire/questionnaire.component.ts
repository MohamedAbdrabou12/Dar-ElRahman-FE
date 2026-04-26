import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Questionnaire} from 'src/app/models/Questionnaire.model';
import {Ring} from 'src/app/models/Ring.model';
import {Surah} from 'src/app/models/Surah.model';
import {QuestionnaireService} from 'src/app/services/questionnaire/questionnaire.service';
import {RingService} from 'src/app/services/ring/ring.service';
import {SurahsService} from 'src/app/services/surahs/surahs.service';
import {QuestionnaireType} from "../../../models/enums/QuestionnaireType.enum";
import {MatDialog} from "@angular/material/dialog";
import {AddQuestionnaireDialogComponent} from "./add-questionnaire-dialog/add-questionnaire-dialog.component";
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class QuestionnaireComponent implements OnInit {
  private dialog = inject(MatDialog);

  data: Questionnaire[] = [];
  filteredData: Questionnaire[] = [];
  rings: Ring[] = [];
  surahs: Surah[] = [];
  rowSelected: Questionnaire | undefined;

  searchTerm = '';
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  buttonName = 'إضافة';
  questionnaire: Questionnaire = {
    questionnaireType: QuestionnaireType.memorization,
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
    private fb: FormBuilder,
    protected authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.getAllQuestionnaires();
    this.getAllRings();
    this.getAllSurahs();
    this.buildQuestionnaireForm();
  }

  private getAllQuestionnaires() {
    this.questionnaireService.getAllQuestionnaires(this.pageNo, this.pageSize).subscribe(
      (response: any) => {
        this.data = response.data;
        this.totalRecords = response.totalRecords;
        this.totalPages = response.totalPages;
        this.applySearch();
        if (!this.rowSelected) {
          this.rowSelected = this.filteredData[0];
        }
      },
      (error) => {
        console.error('Questionnaires fetch failed', error);
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
      row.ring?.name?.toLowerCase().includes(term) ||
      row.currentSurah?.nameAr?.toLowerCase().includes(term) ||
      row.id?.toString().includes(term)
    );
  }

  onSearchChange() {
    this.applySearch();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
    this.getAllQuestionnaires();
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
      questionDate: [new Date(), Validators.required],
      currentSurah: [null, Validators.required],
      ring: [null, Validators.required],
    });
  }

  selectRow(row: any) {
    this.rowSelected = row;
  }


  handleAddClick() {
    const dialogRef = this.dialog.open(AddQuestionnaireDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: false,
        rings: this.rings,
        surahs: this.surahs
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllQuestionnaires();
      }
    });
  }

  editQuestionnaire(questionnaire: Questionnaire) {
    const dialogRef = this.dialog.open(AddQuestionnaireDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: true,
        questionnaire: questionnaire,
        rings: this.rings,
        surahs: this.surahs
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllQuestionnaires();
      }
    });
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

  protected readonly QuestionnaireType = QuestionnaireType;
}
