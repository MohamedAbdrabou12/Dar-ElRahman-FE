import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Period} from 'src/app/models/Period.model';
import {SalarySlab} from 'src/app/models/SalarySlab.model';
import {PeriodService} from 'src/app/services/period/period.service';
import {SalarySlabService} from 'src/app/services/salary-slab/salary-slab.service';

@Component({
  selector: 'app-salary-config',
  templateUrl: './salary-config.component.html',
  styleUrls: ['./salary-config.component.scss'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class SalaryConfigComponent implements OnInit {
  periods: Period[] = [];
  selectedPeriodId: number | null = null;
  slabs: SalarySlab[] = [];
  editingSlabs: SalarySlab[] = [];
  isEditing = false;
  loading = false;
  loadingPeriods = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private salarySlabService: SalarySlabService,
    private periodService: PeriodService
  ) {}

  ngOnInit(): void {
    this.loadPeriods();
  }

  loadPeriods(): void {
    this.loadingPeriods = true;
    this.periodService.getAllPeriods().subscribe({
      next: (response: any) => {
        this.periods = response.data || [];
        this.loadingPeriods = false;
        if (this.periods.length > 0) {
          this.selectedPeriodId = this.periods[0].id;
          this.loadSlabs();
        }
      },
      error: () => {
        this.error = 'حدث خطأ أثناء تحميل الفترات';
        this.loadingPeriods = false;
      }
    });
  }

  onPeriodChange(): void {
    this.isEditing = false;
    this.editingSlabs = [];
    this.error = null;
    this.success = null;
    this.loadSlabs();
  }

  loadSlabs(): void {
    if (!this.selectedPeriodId) return;
    this.loading = true;
    this.error = null;
    this.salarySlabService.getSlabs(this.selectedPeriodId).subscribe({
      next: (response: any) => {
        this.slabs = response.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'حدث خطأ أثناء تحميل إعدادات الرواتب';
        this.loading = false;
      }
    });
  }

  startEditing(): void {
    this.editingSlabs = this.slabs.map(s => ({...s}));
    this.isEditing = true;
    this.error = null;
    this.success = null;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editingSlabs = [];
    this.error = null;
  }

  addSlab(): void {
    const nextOrder = this.editingSlabs.length > 0
      ? Math.max(...this.editingSlabs.map(s => s.displayOrder)) + 1
      : 1;
    this.editingSlabs.push({
      label: '',
      minPercentage: 0,
      maxPercentage: 0,
      salaryAmount: 0,
      displayOrder: nextOrder,
      periodId: this.selectedPeriodId!
    } as SalarySlab);
  }

  removeSlab(index: number): void {
    const slab = this.editingSlabs[index];
    if (slab.id) {
      this.salarySlabService.deleteSlab(slab.id).subscribe({
        next: () => {
          this.editingSlabs.splice(index, 1);
          this.slabs = this.slabs.filter(s => s.id !== slab.id);
        },
        error: (err) => {
          this.error = err?.error?.message || 'حدث خطأ أثناء حذف الشريحة';
        }
      });
    } else {
      this.editingSlabs.splice(index, 1);
    }
  }

  saveAll(): void {
    for (const slab of this.editingSlabs) {
      if (!slab.label || slab.label.trim() === '') {
        this.error = 'يرجى إدخال اسم لكل شريحة';
        return;
      }
      if (slab.salaryAmount < 0) {
        this.error = `مبلغ الراتب لا يمكن أن يكون سالباً في الشريحة: ${slab.label}`;
        return;
      }
      if (slab.minPercentage >= slab.maxPercentage) {
        this.error = `الحد الأدنى يجب أن يكون أقل من الحد الأعلى في الشريحة: ${slab.label}`;
        return;
      }
    }

    const sorted = [...this.editingSlabs].sort((a, b) => a.minPercentage - b.minPercentage);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].maxPercentage > sorted[i + 1].minPercentage) {
        this.error = `تداخل في نطاق النسب بين الشريحة "${sorted[i].label}" والشريحة "${sorted[i + 1].label}"`;
        return;
      }
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const newSlabs = this.editingSlabs.filter(s => !s.id);
    const existingSlabs = this.editingSlabs.filter(s => !!s.id);

    let pending = 0;
    let failed = false;

    const checkDone = () => {
      if (pending === 0 && !failed) {
        this.isEditing = false;
        this.editingSlabs = [];
        this.success = 'تم حفظ إعدادات الرواتب بنجاح';
        this.loading = false;
        this.loadSlabs();
        setTimeout(() => this.success = null, 4000);
      }
    };

    if (existingSlabs.length > 0) {
      pending++;
      this.salarySlabService.updateAllSlabs(existingSlabs).subscribe({
        next: () => { pending--; checkDone(); },
        error: (err) => {
          failed = true;
          this.error = err?.error?.message || 'حدث خطأ أثناء حفظ الإعدادات';
          this.loading = false;
        }
      });
    }

    for (const slab of newSlabs) {
      slab.periodId = this.selectedPeriodId!;
      pending++;
      this.salarySlabService.createSlab(slab).subscribe({
        next: () => { pending--; checkDone(); },
        error: (err) => {
          failed = true;
          this.error = err?.error?.message || 'حدث خطأ أثناء إضافة شريحة جديدة';
          this.loading = false;
        }
      });
    }

    if (pending === 0) {
      this.loading = false;
      this.isEditing = false;
    }
  }

  getPercentageRangeLabel(slab: SalarySlab): string {
    return `من ${slab.minPercentage}% إلى ${slab.maxPercentage}%`;
  }

  get selectedPeriodName(): string {
    return this.periods.find(p => p.id === this.selectedPeriodId)?.name || '';
  }
}
