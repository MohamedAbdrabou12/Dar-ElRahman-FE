import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReportService, ReportDefinition, ReportDataResponse, REPORT_DEFINITIONS} from '../../../services/report/report.service';
import {PeriodService} from '../../../services/period/period.service';
import {RingService} from '../../../services/ring/ring.service';
import {Period} from '../../../models/Period.model';
import {Ring} from '../../../models/Ring.model';
import {normalizeArabic} from '../../../utils/arabic-normalizer';
import {AuthService} from '../../../services/auth.service';

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
  ringId: number | null = null;

  // Lookup data
  periods: Period[] = [];
  rings: Ring[] = [];
  allRings: Ring[] = [];

  // Download state
  downloading: { [key: string]: boolean } = {};
  downloadError: { [key: string]: string } = {};

  // View state
  viewingReport: ReportDefinition | null = null;
  reportData: ReportDataResponse | null = null;
  loadingView = false;
  viewError = '';
  searchTerm = '';

  constructor(
    private reportService: ReportService,
    private periodService: PeriodService,
    private ringService: RingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setDefaultDates();
    // Set default category to first visible one for the user
    const visibleCats = this.getVisibleCategories();
    if (visibleCats.length > 0 && !visibleCats.some(c => c.key === this.activeCategory)) {
      this.activeCategory = visibleCats[0].key;
    }
    this.filterReports();
    this.loadPeriods();
    this.loadRings();
  }

  loadPeriods(): void {
    this.periodService.getAllPeriods().subscribe({
      next: (res: any) => this.periods = res.data || [],
      error: () => this.periods = []
    });
  }

  loadRings(): void {
    this.ringService.getAllRings(0, 200).subscribe({
      next: (res: any) => {
        this.allRings = res.data || [];
        this.rings = this.allRings;
      },
      error: () => { this.allRings = []; this.rings = []; }
    });
  }

  onPeriodChange(): void {
    if (this.periodId) {
      this.rings = this.allRings.filter(r => r.periodId === this.periodId);
    } else {
      this.rings = this.allRings;
    }
    this.ringId = null;
  }

  hasAnyFilter(filterType: string): boolean {
    return this.filteredReports.some((r: any) => r[filterType]);
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
    this.filteredReports = this.allReports.filter(
      r => r.category === this.activeCategory && this.authService.hasAnyRole(r.roles)
    );
  }

  getVisibleCategories(): CategoryTab[] {
    return this.categories.filter(cat =>
      this.allReports.some(r => r.category === cat.key && this.authService.hasAnyRole(r.roles))
    );
  }

  viewReport(report: ReportDefinition): void {
    this.viewingReport = report;
    this.reportData = null;
    this.loadingView = true;
    this.viewError = '';
    this.searchTerm = '';

    this.reportService.getReportData(
      report.key,
      report.hasDateRange ? this.dateFrom : undefined,
      report.hasDateRange ? this.dateTo : undefined,
      report.hasPeriodFilter && this.periodId ? this.periodId : undefined,
      report.hasRingFilter && this.ringId ? this.ringId : undefined
    ).subscribe({
      next: (data: ReportDataResponse) => {
        this.reportData = data;
        this.loadingView = false;
      },
      error: () => {
        this.loadingView = false;
        this.viewError = 'حدث خطأ أثناء تحميل بيانات التقرير';
      },
    });
  }

  closeView(): void {
    this.viewingReport = null;
    this.reportData = null;
    this.viewError = '';
    this.searchTerm = '';
  }

  get filteredRows(): string[][] {
    if (!this.reportData?.rows) return [];
    if (!this.searchTerm.trim()) return this.reportData.rows;
    const term = normalizeArabic(this.searchTerm.trim().toLowerCase());
    return this.reportData.rows.filter(row =>
      row.some(cell => normalizeArabic(cell).toLowerCase().includes(term))
    );
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
      report.hasPeriodFilter && this.periodId ? this.periodId : undefined,
      report.hasRingFilter && this.ringId ? this.ringId : undefined
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
      error: () => {
        this.downloading[stateKey] = false;
        this.downloadError[stateKey] = 'حدث خطأ أثناء تحميل التقرير';
        setTimeout(() => this.downloadError[stateKey] = '', 4000);
      },
    });
  }

  printReport(): void {
    window.print();
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
