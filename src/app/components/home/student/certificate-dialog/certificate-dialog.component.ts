import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Student} from '../../../../models/Student.model';

export interface CertificateDialogData {
  student: Student;
}

export interface Milestone {
  parts: number;
  labelAr: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-certificate-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './certificate-dialog.component.html',
  styleUrls: ['./certificate-dialog.component.scss']
})
export class CertificateDialogComponent {
  milestones: Milestone[] = [
    {parts: 5, labelAr: 'خمسة أجزاء', icon: 'fas fa-star', color: '#cd7f32'},
    {parts: 10, labelAr: 'عشرة أجزاء', icon: 'fas fa-star', color: '#c0c0c0'},
    {parts: 15, labelAr: 'خمسة عشر جزءاً', icon: 'fas fa-star', color: '#ffd700'},
    {parts: 20, labelAr: 'عشرون جزءاً', icon: 'fas fa-gem', color: '#50c878'},
    {parts: 25, labelAr: 'خمسة وعشرون جزءاً', icon: 'fas fa-gem', color: '#4169e1'},
    {parts: 30, labelAr: 'القرآن الكريم كاملاً', icon: 'fas fa-crown', color: '#8b008b'}
  ];

  selectedMilestone: Milestone | null = null;
  showCertificate = false;
  today = new Date();

  constructor(
    public dialogRef: MatDialogRef<CertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CertificateDialogData
  ) {}

  selectMilestone(milestone: Milestone): void {
    this.selectedMilestone = milestone;
    this.showCertificate = true;
  }

  goBack(): void {
    this.showCertificate = false;
    this.selectedMilestone = null;
  }

  printCertificate(): void {
    const printContents = document.getElementById('certificate-print-area');
    if (!printContents) return;

    const printWindow = window.open('', '_blank', 'width=1100,height=800');
    if (!printWindow) return;

    const baseUrl = window.location.origin + '/';
    let htmlContent = printContents.innerHTML;
    htmlContent = htmlContent.replace(/src="assets\//g, `src="${baseUrl}assets/`);

    printWindow.document.write(`
      <html dir="rtl" lang="ar">
      <head>
        <base href="${baseUrl}">
        <title>شهادة إتمام حفظ</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }

          @page {
            size: A4 landscape;
            margin: 0;
          }

          body {
            font-family: 'Cairo', 'Amiri', serif;
            direction: rtl;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f5f5f5;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .certificate-wrapper {
            width: 297mm;
            height: 210mm;
            position: relative;
            background: #fffef8;
            overflow: hidden;
          }

          .certificate-border-outer {
            position: absolute;
            inset: 8mm;
            border: 3px solid ${this.selectedMilestone?.color || '#1a6b3c'};
            border-radius: 8px;
          }

          .certificate-border-inner {
            position: absolute;
            inset: 12mm;
            border: 1.5px solid ${this.selectedMilestone?.color || '#1a6b3c'};
            border-radius: 4px;
          }

          .corner-ornament {
            position: absolute;
            width: 40px;
            height: 40px;
            color: ${this.selectedMilestone?.color || '#1a6b3c'};
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .corner-ornament.top-right { top: 14mm; right: 14mm; }
          .corner-ornament.top-left { top: 14mm; left: 14mm; }
          .corner-ornament.bottom-right { bottom: 14mm; right: 14mm; }
          .corner-ornament.bottom-left { bottom: 14mm; left: 14mm; }

          .certificate-content {
            position: absolute;
            inset: 18mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 8mm 15mm;
            text-align: center;
          }

          .cert-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .cert-header .logo-area {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .cert-header .logo-area img {
            width: 60px;
            height: 60px;
            object-fit: contain;
          }

          .cert-org-name {
            font-family: 'Amiri', serif;
            font-size: 22px;
            font-weight: 700;
            color: #1a6b3c;
            letter-spacing: 1px;
          }

          .cert-subtitle {
            font-size: 13px;
            color: #666;
          }

          .cert-divider {
            width: 200px;
            height: 2px;
            background: linear-gradient(90deg, transparent, ${this.selectedMilestone?.color || '#1a6b3c'}, transparent);
            margin: 2px auto;
          }

          .cert-title-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
          }

          .cert-title {
            font-family: 'Amiri', serif;
            font-size: 36px;
            font-weight: 700;
            color: ${this.selectedMilestone?.color || '#1a6b3c'};
          }

          .cert-milestone-icon {
            font-size: 32px;
            color: ${this.selectedMilestone?.color || '#1a6b3c'};
          }

          .cert-body {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .cert-text {
            font-size: 18px;
            color: #333;
            line-height: 1.8;
          }

          .cert-student-name {
            font-family: 'Amiri', serif;
            font-size: 30px;
            font-weight: 700;
            color: #1a3c6b;
            padding: 4px 30px;
            border-bottom: 2px solid ${this.selectedMilestone?.color || '#1a6b3c'};
          }

          .cert-milestone-text {
            font-family: 'Amiri', serif;
            font-size: 22px;
            font-weight: 700;
            color: ${this.selectedMilestone?.color || '#1a6b3c'};
          }

          .cert-quran-verse {
            font-family: 'Amiri', serif;
            font-size: 16px;
            color: #1a6b3c;
            font-style: italic;
            max-width: 500px;
            margin-top: 4px;
          }

          .cert-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
            padding: 0 20px;
          }

          .cert-footer-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
          }

          .cert-footer-label {
            font-size: 13px;
            color: #666;
          }

          .cert-footer-value {
            font-size: 15px;
            font-weight: 700;
            color: #333;
          }

          .cert-signature-line {
            width: 150px;
            border-top: 1.5px solid #999;
            margin-top: 30px;
          }

          .cert-profile-pic {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid ${this.selectedMilestone?.color || '#1a6b3c'};
          }

          .cert-profile-placeholder {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: #f0f0f0;
            border: 2px solid ${this.selectedMilestone?.color || '#1a6b3c'};
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 28px;
          }

          @media print {
            body { background: white; }
            .certificate-wrapper { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
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

  onClose(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date): string {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  getHijriYear(): string {
    const gregorianYear = this.today.getFullYear();
    const approxHijri = Math.round((gregorianYear - 622) * (33 / 32));
    return `${approxHijri} هـ`;
  }
}
