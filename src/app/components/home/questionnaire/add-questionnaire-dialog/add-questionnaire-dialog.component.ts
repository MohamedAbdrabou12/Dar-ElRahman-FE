import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Questionnaire } from '../../../../models/Questionnaire.model';
import { Ring } from '../../../../models/Ring.model';
import { Surah } from '../../../../models/Surah.model';
import { QuestionnaireType } from '../../../../models/enums/QuestionnaireType.enum';
import { QuestionnaireService } from '../../../../services/questionnaire/questionnaire.service';
import { AlertService } from '../../../../services/alert.service';

export interface QuestionnaireDialogData {
  isEdit: boolean;
  questionnaire?: Questionnaire;
  rings: Ring[];
  surahs: Surah[];
}

@Component({
  selector: 'app-add-questionnaire-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './add-questionnaire-dialog.component.html',
  styleUrls: ['./add-questionnaire-dialog.component.scss']
})
export class AddQuestionnaireDialogComponent implements OnInit {
  questionnaireForm!: FormGroup;
  rings: Ring[] = [];
  surahs: Surah[] = [];
  questionnaireTypes = Object.values(QuestionnaireType);
  surahLoading = false;
  surahAutoPopulated = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddQuestionnaireDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuestionnaireDialogData,
    private questionnaireService: QuestionnaireService,
    private alertService: AlertService
  ) {
    this.rings = data.rings;
    this.surahs = data.surahs;
  }

  ngOnInit(): void {
    this.initForm();

    if (this.data.isEdit && this.data.questionnaire) {
      const selectedRing = this.rings.find(r => r.id === this.data.questionnaire?.ringId);
      const selectedSurah = this.surahs.find(s => s.id === this.data.questionnaire?.currentSurah?.id);

      this.questionnaireForm.patchValue({
        id: this.data.questionnaire.id,
        questionnaireType: this.data.questionnaire.questionnaireType,
        questionDate: this.formatDateForInput(this.data.questionnaire.questionDate),
        currentSurah: selectedSurah || null,
        ring: selectedRing || null
      });
      this.surahAutoPopulated = true;
      this.questionnaireForm.get('currentSurah')?.disable();
    }
  }

  onRingOrTypeChange(): void {
    const ring = this.questionnaireForm.get('ring')?.value;
    const type = this.questionnaireForm.get('questionnaireType')?.value;

    if (!ring || !ring.id || !type) {
      this.questionnaireForm.get('currentSurah')?.enable();
      this.questionnaireForm.patchValue({ currentSurah: null });
      this.surahAutoPopulated = false;
      return;
    }

    this.surahLoading = true;
    this.questionnaireService.getLastDoneQuestionnaire(ring.id, type).subscribe({
      next: (response: any) => {
        this.surahLoading = false;
        const lastDone = response?.data;
        if (lastDone && lastDone.nextSurah) {
          const matched = this.surahs.find(s => s.id === lastDone.nextSurah.id);
          this.questionnaireForm.patchValue({ currentSurah: matched || null });
          this.surahAutoPopulated = !!matched;
        } else {
          const firstSurah = this.surahs.length > 0 ? this.surahs[0] : null;
          this.questionnaireForm.patchValue({ currentSurah: firstSurah });
          this.surahAutoPopulated = !!firstSurah;
        }
        if (this.surahAutoPopulated) {
          this.questionnaireForm.get('currentSurah')?.disable();
        } else {
          this.questionnaireForm.get('currentSurah')?.enable();
        }
      },
      error: () => {
        this.surahLoading = false;
        this.surahAutoPopulated = false;
        this.questionnaireForm.get('currentSurah')?.enable();
      }
    });
  }

  private initForm(): void {
    this.questionnaireForm = this.fb.group({
      id: [null],
      questionnaireType: [QuestionnaireType.memorization, Validators.required],
      questionDate: ['', Validators.required],
      currentSurah: [null, Validators.required],
      ring: [null, Validators.required]
    });
  }

  private formatDateForInput(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getArabicQuestionnaireType(type: string): string {
    const typeMap: { [key: string]: string } = {
      [QuestionnaireType.memorization]: 'تسميع',
      [QuestionnaireType.revision]: 'مراجعة'
    };
    return typeMap[type] || type;
  }

  onSubmit(): void {
    if (this.questionnaireForm.valid || (this.surahAutoPopulated && this.questionnaireForm.get('currentSurah')?.disabled)) {
      const formValue = this.questionnaireForm.getRawValue();
      const formattedData = {
        ...formValue,
        questionDate: this.formatDate(formValue.questionDate),
        ringId: formValue.ring.id,
        currentSurahId: formValue.currentSurah.id
      };
      const action = this.data.isEdit
        ? this.questionnaireService.updateQuestionnaire(formattedData)
        : this.questionnaireService.addQuestionnaire(formattedData);

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
}
