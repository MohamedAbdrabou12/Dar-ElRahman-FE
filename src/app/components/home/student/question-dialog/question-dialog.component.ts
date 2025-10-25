import {Component, Inject, inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {SurahDateComponent} from '../surah-date/surah-date.component';
import {StudentService} from "../../../../services/student/student.service";
import {StudentSurah} from "../../../../models/StudentSurah.model";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-question-dialog',
  imports: [MatDialogModule, SurahDateComponent, NgIf],
  templateUrl: './question-dialog.component.html',
  styleUrl: './question-dialog.component.scss',
})
export class QuestionDialogComponent implements OnInit {

  studentSurahs: StudentSurah[] = []

  readonly dialogRef = inject(MatDialogRef<QuestionDialogComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number | undefined },
    private studentService: StudentService
  ) {
  }

  ngOnInit(): void {
    console.log("The data is", this.data)
    if (this.data.studentId) {
      this.getCompletedSurahsByStudentId(this.data.studentId);
    } else {
      console.warn('No studentId passed to QuestionDialogComponent');
    }
  }

  getCompletedSurahsByStudentId(studentId: number) {
    this.studentService.getCompletedSurahsByStudentId(studentId).subscribe(
      (response: any) => {
        this.studentSurahs = response.data;
      },
      (error) => {
        console.error('Student surahs fetch failed', error);
      }
    );
  }
}
