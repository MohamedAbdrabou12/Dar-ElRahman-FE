import {Component, Inject, inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {SurahDateComponent} from '../surah-date/surah-date.component';
import {StudentService} from "../../../../services/student/student.service";
import {StudentSurah} from "../../../../models/StudentSurah.model";
import {Grade} from "../../../../models/enums/Grade.enum";

@Component({
  selector: 'app-question-dialog',
  imports: [CommonModule, MatDialogModule, SurahDateComponent],
  templateUrl: './question-dialog.component.html',
  styleUrl: './question-dialog.component.scss',
})
export class QuestionDialogComponent implements OnInit {

  studentSurahs: StudentSurah[] = []

  readonly dialogRef = inject(MatDialogRef<QuestionDialogComponent>);

  private gradeMap: { [key: string]: string } = {
    [Grade.excellent]: 'ممتاز',
    [Grade.very_good]: 'جيد جدا',
    [Grade.good]: 'جيد'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number | undefined; studentName?: string },
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

  printSurahReport(): void {
    if (!this.studentSurahs || this.studentSurahs.length === 0) return;

    const printWindow = window.open('', '_blank', 'width=1100,height=800');
    if (!printWindow) return;

    const baseUrl = window.location.origin + '/';
    const today = new Date();
    const formattedDate = this.formatDate(today);
    const hijriYear = this.getHijriYear(today);
    const studentName = this.data.studentName || 'الطالب';

    const rows = this.studentSurahs.map((s, i) => {
      const gradeAr = this.getArabicGrade(s.grade);
      const gradeColor = this.getGradeColor(s.grade);
      const date = s.successDate ? this.formatDate(new Date(s.successDate)) : '—';
      return `
        <tr>
          <td style="padding: 10px 14px; text-align: center; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px;">${i + 1}</td>
          <td style="padding: 10px 14px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937; font-size: 15px;">${s.surah?.nameAr || ''}</td>
          <td style="padding: 10px 14px; text-align: center; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 13px;">${s.surah?.numberOfVerses || ''}</td>
          <td style="padding: 10px 14px; text-align: center; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 13px;">${date}</td>
          <td style="padding: 10px 14px; text-align: center; border-bottom: 1px solid #e5e7eb;">
            <span style="display: inline-block; padding: 3px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; background: ${gradeColor.bg}; color: ${gradeColor.text};">${gradeAr}</span>
          </td>
        </tr>`;
    }).join('');

    printWindow.document.write(`
      <html dir="rtl" lang="ar">
      <head>
        <base href="${baseUrl}">
        <title>سجل السور المحفوظة - ${studentName}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: A4 portrait; margin: 12mm; }
          body {
            font-family: 'Cairo', sans-serif;
            direction: rtl;
            background: #f8f9fa;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .report-page {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            padding: 30px 36px;
            min-height: 100vh;
          }
          .report-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 8px;
          }
          .report-header img {
            width: 56px;
            height: 56px;
            object-fit: contain;
          }
          .report-header-text {
            text-align: center;
          }
          .report-org-name {
            font-family: 'Amiri', serif;
            font-size: 20px;
            font-weight: 700;
            color: #1a6b3c;
          }
          .report-org-sub {
            font-size: 12px;
            color: #666;
          }
          .report-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #1a6b3c, transparent);
            margin: 12px 0 20px;
          }
          .report-title {
            text-align: center;
            font-family: 'Amiri', serif;
            font-size: 26px;
            font-weight: 700;
            color: #1a6b3c;
            margin-bottom: 4px;
          }
          .report-student-row {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 28px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }
          .report-student-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
          }
          .report-student-item .label {
            color: #6b7280;
          }
          .report-student-item .value {
            font-weight: 700;
            color: #1f2937;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          }
          thead th {
            background: #1a6b3c;
            color: white;
            padding: 12px 14px;
            font-size: 13px;
            font-weight: 700;
          }
          tbody tr:nth-child(even) td {
            background: #f9fafb;
          }
          tbody tr:hover td {
            background: #f0fdf4;
          }
          .report-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 36px;
            padding: 0 10px;
          }
          .report-footer-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
          }
          .report-footer-label {
            font-size: 12px;
            color: #666;
          }
          .report-footer-value {
            font-size: 14px;
            font-weight: 700;
            color: #333;
          }
          .report-signature-line {
            width: 140px;
            border-top: 1.5px solid #999;
            margin-top: 28px;
          }
          .report-summary {
            display: flex;
            justify-content: center;
            gap: 32px;
            margin-bottom: 18px;
            flex-wrap: wrap;
          }
          .summary-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px 22px;
            border-radius: 10px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
          }
          .summary-card .num {
            font-size: 24px;
            font-weight: 800;
            color: #1a6b3c;
          }
          .summary-card .lbl {
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { background: white; }
            .report-page { box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="report-page">
          <div class="report-header">
            <img src="assets/imgs/logo.jpg" alt="Logo" />
            <div class="report-header-text">
              <div class="report-org-name">دار عباد الرحمن  لخدمة القرآن الكريم بالنصارية</div>
              <div class="report-org-sub">Dar Al-Rahman for Quran Memorization</div>
            </div>
            <img src="assets/imgs/logo.jpg" alt="Logo" />
          </div>
          <div class="report-divider"></div>

          <div class="report-title">
            <i class="fas fa-book-quran" style="margin-left: 8px;"></i>
            سجل السور المحفوظة
          </div>

          <div class="report-student-row">
            <div class="report-student-item">
              <span class="label">اسم الطالب:</span>
              <span class="value">${studentName}</span>
            </div>
            <div class="report-student-item">
              <span class="label">عدد السور:</span>
              <span class="value">${this.studentSurahs.length}</span>
            </div>
            <div class="report-student-item">
              <span class="label">تاريخ الطباعة:</span>
              <span class="value">${formattedDate}</span>
            </div>
          </div>

          <div class="report-summary">
            <div class="summary-card">
              <span class="num">${this.studentSurahs.length}</span>
              <span class="lbl">إجمالي السور</span>
            </div>
            <div class="summary-card">
              <span class="num">${this.studentSurahs.filter(s => s.grade === Grade.excellent).length}</span>
              <span class="lbl">ممتاز</span>
            </div>
            <div class="summary-card">
              <span class="num">${this.studentSurahs.filter(s => s.grade === Grade.very_good).length}</span>
              <span class="lbl">جيد جدا</span>
            </div>
            <div class="summary-card">
              <span class="num">${this.studentSurahs.filter(s => s.grade === Grade.good).length}</span>
              <span class="lbl">جيد</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="text-align: center; width: 50px;">#</th>
                <th style="text-align: right;">اسم السورة</th>
                <th style="text-align: center;">عدد الآيات</th>
                <th style="text-align: center;">تاريخ التسميع</th>
                <th style="text-align: center;">التقييم</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="report-footer">
            <div class="report-footer-item">
              <span class="report-footer-label">التاريخ</span>
              <span class="report-footer-value">${formattedDate}</span>
              <span class="report-footer-label">${hijriYear}</span>
            </div>
            <div class="report-footer-item">
              <span class="report-footer-label">إدارة الدار</span>
              <div class="report-signature-line"></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }

  private getArabicGrade(grade: Grade | undefined): string {
    if (!grade) return '';
    return this.gradeMap[grade] || grade;
  }

  private getGradeColor(grade: Grade | undefined): { bg: string; text: string } {
    switch (grade) {
      case Grade.excellent: return {bg: '#d1fae5', text: '#065f46'};
      case Grade.very_good: return {bg: '#dbeafe', text: '#1e40af'};
      case Grade.good: return {bg: '#fef3c7', text: '#92400e'};
      default: return {bg: '#f3f4f6', text: '#374151'};
    }
  }

  private formatDate(date: Date): string {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  private getHijriYear(date: Date): string {
    const gregorianYear = date.getFullYear();
    const approxHijri = Math.round((gregorianYear - 622) * (33 / 32));
    return `${approxHijri} هـ`;
  }
}
