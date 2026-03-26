import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SalarySlab} from 'src/app/models/SalarySlab.model';
import {SalarySlabService} from 'src/app/services/salary-slab/salary-slab.service';

@Component({
  selector: 'app-salary-config',
  templateUrl: './salary-config.component.html',
  styleUrls: ['./salary-config.component.scss'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class SalaryConfigComponent implements OnInit {
  slabs: SalarySlab[] = [];
  editingSlabs: SalarySlab[] = [];
  isEditing = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private salarySlabService: SalarySlabService) {
  }

  ngOnInit(): void {
    this.loadSlabs();
  }

  loadSlabs(): void {
    this.loading = true;
    this.error = null;
    this.salarySlabService.getAllSlabs().subscribe({
      next: (response: any) => {
        this.slabs = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'حدث خطأ أثناء تحميل إعدادات الرواتب';
        this.loading = false;
        console.error('Failed to load salary slabs', err);
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

  saveAll(): void {
    // Validate before saving
    for (const slab of this.editingSlabs) {
      if (slab.salaryAmount < 0) {
        this.error = `مبلغ الراتب لا يمكن أن يكون سالباً في الشريحة: ${slab.label}`;
        return;
      }
      if (slab.minPercentage >= slab.maxPercentage) {
        this.error = `الحد الأدنى يجب أن يكون أقل من الحد الأعلى في الشريحة: ${slab.label}`;
        return;
      }
    }

    // Check for overlapping ranges
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

    this.salarySlabService.updateAllSlabs(this.editingSlabs).subscribe({
      next: (response: any) => {
        this.slabs = response.data || [];
        this.isEditing = false;
        this.editingSlabs = [];
        this.success = 'تم حفظ إعدادات الرواتب بنجاح';
        this.loading = false;
        setTimeout(() => this.success = null, 4000);
      },
      error: (err) => {
        this.error = err?.error?.message || 'حدث خطأ أثناء حفظ الإعدادات';
        this.loading = false;
      }
    });
  }

  getPercentageRangeLabel(slab: SalarySlab): string {
    return `من ${slab.minPercentage}% إلى ${slab.maxPercentage}%`;
  }
}
