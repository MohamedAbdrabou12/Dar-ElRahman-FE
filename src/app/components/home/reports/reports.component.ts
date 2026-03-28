import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReportService, ReportDefinition, REPORT_DEFINITIONS} from '../../../services/report/report.service';

interface CategoryTab {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  categories: CategoryTab[] = [
    {key: 'financial', label: 'التقارير المالية', icon: 'fas fa-coins'},
    {key: 'student', label: 'تقارير الطلبة', icon: 'fas fa-user-graduate'},
    {key: 'teacher', label: 'تقارير المعلمين', icon: 'fas fa-chalkboard-teacher'},
    {key: 'operational', label: 'التقارير التشغيلية', icon: 'fas fa-cogs'},
  ];

  activeCategory = 'financial';
  filteredReports: ReportDefinition[] = [];
  allReports = REPORT_DEFINITIONS;

  // Filters
  dateFrom = '';
  dateTo = '';
  periodId: number | null = null;

  // Download state
  downloading: { [key: string]: boolean } = {};
  downloadError: { [key: string]: string } = {};

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.filterReports();
  }

  setDefaultDates(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.dateFrom = this.formatDate(firstDay);
    this.dateTo = this.formatDate(now);
  }

  selectCategory(key: string): void {
    this.activeCategory = key;
    this.filterReports();
  }

  filterReports(): void {
    this.filteredReports = this.allReports.filter(r => r.category === this.activeCategory);
  }

  download(report: ReportDefinition, format: 'PDF' | 'CSV'): void {
    const stateKey = report.key + '-' + format;
    this.downloading[stateKey] = true;
    this.downloadError[stateKey] = '';

    this.reportService.downloadReport(
      report.key,
      format,
      report.hasDateRange ? this.dateFrom : undefined,
      report.hasDateRange ? this.dateTo : undefined,
      report.hasPeriodFilter && this.periodId ? this.periodId : undefined
    ).subscribe({
      next: (blob: Blob) => {
        this.downloading[stateKey] = false;
        const ext = format === 'PDF' ? '.pdf' : '.csv';
        const fileName = report.key.toLowerCase().replace(/_/g, '-') + ext;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        this.downloading[stateKey] = false;
        this.downloadError[stateKey] = 'حدث خطأ أثناء تحميل التقرير';
        setTimeout(() => this.downloadError[stateKey] = '', 4000);
      },
    });
  }

  isDownloading(reportKey: string, format: string): boolean {
    return !!this.downloading[reportKey + '-' + format];
  }

  getError(reportKey: string, format: string): string {
    return this.downloadError[reportKey + '-' + format] || '';
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
