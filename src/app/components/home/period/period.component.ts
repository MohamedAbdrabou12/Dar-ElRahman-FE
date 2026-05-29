import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {PeriodService} from 'src/app/services/period/period.service';
import {AuthService} from 'src/app/services/auth.service';
import {Period} from 'src/app/models/Period.model';
import {AddPeriodDialogComponent} from './add-period-dialog/add-period-dialog.component';

@Component({
  selector: 'app-period',
  imports: [CommonModule, FormsModule],
  templateUrl: './period.component.html',
  styleUrl: './period.component.scss',
})
export class PeriodComponent implements OnInit {
  private dialog = inject(MatDialog);

  data: Period[] = [];
  filteredData: Period[] = [];
  rowSelected: Period | null = null;
  error: any;
  deleteError: any;
  isAdmin = false;
  billingLoading = false;
  billingSuccess: string | null = null;
  billingError: string | null = null;

  searchTerm = '';
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  constructor(private periodService: PeriodService, protected authService: AuthService) {
    this.isAdmin = this.authService.hasRole('ADMIN');
  }

  ngOnInit(): void {
    this.getAllPeriods();
  }

  private getAllPeriods() {
    this.periodService.getPeriods(this.pageNo, this.pageSize, true).subscribe(
      (response: any) => {
        this.data = response.data;
        this.totalRecords = response.totalRecords ?? response.data?.length ?? 0;
        this.totalPages = Math.max(response.totalPages ?? 0, Math.ceil(this.totalRecords / this.pageSize));
        this.applySearch();
        if (!this.rowSelected && this.filteredData.length > 0) {
          this.rowSelected = this.filteredData[0];
        }
      },
      (error) => {
        console.error('Period failed', error);
        this.error = error;
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
      row.name?.toLowerCase().includes(term) ||
      row.id?.toString().includes(term) ||
      row.description?.toLowerCase().includes(term)
    );
  }

  onSearchChange() {
    this.applySearch();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
    this.getAllPeriods();
  }

  selectRow(row: Period) {
    this.rowSelected = row;
  }

  handleAddClick() {
    const dialogRef = this.dialog.open(AddPeriodDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllPeriods();
      }
    });
  }

  editPeriod(period: Period) {
    const dialogRef = this.dialog.open(AddPeriodDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: true,
        period: period,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllPeriods();
      }
    });
  }

  deletePeriod(period: Period) {
    this.periodService.deletePeriod(period.id).subscribe(
      (data) => {
        this.data = this.data.filter((p) => p.id !== period.id);
        if (this.rowSelected?.id === period.id) {
          this.rowSelected = this.data.length > 0 ? this.data[0] : null;
        }
        this.deleteError = null;
      },
      (error) => {
        console.log(error);
        this.deleteError = error;
      }
    );
  }

  generateBills(period: Period) {
    if (!confirm(`هل أنت متأكد من إصدار فواتير الشهر للفترة "${period.name}"؟\nالرسوم الشهرية: ${period.monthlyTuition || 0} ج.م`)) {
      return;
    }
    this.billingLoading = true;
    this.billingSuccess = null;
    this.billingError = null;
    this.periodService.generateMonthlyBills(period.id).subscribe({
      next: (response: any) => {
        this.billingLoading = false;
        const count = response.data ?? response;
        this.billingSuccess = `تم إصدار ${count} فاتورة بنجاح للفترة "${period.name}" وإرسالها عبر البريد الإلكتروني.`;
      },
      error: (error: any) => {
        this.billingLoading = false;
        this.billingError = error?.error?.message || error?.error?.errorDescription || 'حدث خطأ أثناء إصدار الفواتير';
      },
    });
  }

  getDayOfWeekArabic(day: string): string {
    const daysMap: { [key: string]: string } = {
      SUNDAY: 'الأحد',
      MONDAY: 'الإثنين',
      TUESDAY: 'الثلاثاء',
      WEDNESDAY: 'الأربعاء',
      THURSDAY: 'الخميس',
      FRIDAY: 'الجمعة',
      SATURDAY: 'السبت',
    };
    return daysMap[day] || day;
  }
}
