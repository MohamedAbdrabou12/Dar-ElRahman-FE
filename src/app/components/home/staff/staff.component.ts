import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StaffService} from 'src/app/services/staff/staff.service';
import {MatDialog} from '@angular/material/dialog';
import {AddStaffDialogComponent} from './add-staff-dialog/add-staff-dialog.component';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-staff',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss',
})
export class StaffComponent implements OnInit {
  private dialog = inject(MatDialog);

  data: any[] = [];
  filteredData: any[] = [];
  rowSelected: any;
  today = new Date();

  filterForm!: FormGroup;
  showFilters = false;
  staffTypes = ['ADMIN', 'TECHNICAL', 'SUPERVISOR'];
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  error: any;
  deleteError: any;

  constructor(private staffService: StaffService, private fb: FormBuilder, protected authService: AuthService) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      staffName: [''],
      staffType: [null],
      outOfWork: [null]
    });
    this.getAllStaff();
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private getAllStaff() {
    this.staffService.getAllStaff(0, 10000).subscribe(
      (response: any) => {
        this.data = response.data;
        this.applyFilters();
        if (!this.rowSelected) {
          this.rowSelected = this.filteredData[0];
        }
      },
      (error) => {
        console.error('Staff fetch failed', error);
      }
    );
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.filterForm.reset({
      staffName: '',
      staffType: null,
      outOfWork: null
    });
  }

  applyFilters() {
    const filters = this.filterForm?.value;
    if (!filters) {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter((row: any) => {
        const nameMatch = !filters.staffName || row.fullName?.toLowerCase().includes(filters.staffName.toLowerCase()) || row.nationalId?.toLowerCase().includes(filters.staffName.toLowerCase()) || row.phoneNumber?.toLowerCase().includes(filters.staffName.toLowerCase());
        const typeMatch = !filters.staffType || row.staffType === filters.staffType;
        const outOfWorkMatch = filters.outOfWork === null || filters.outOfWork === '' || row.outOfWork === (filters.outOfWork === 'true');
        return nameMatch && typeMatch && outOfWorkMatch;
      });
    }
    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.pageNo >= this.totalPages) this.pageNo = 0;
  }

  get paginatedData() {
    const start = this.pageNo * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
  }

  selectRow(row: any) {
    this.rowSelected = row;
  }

  handleAddClick() {
    const dialogRef = this.dialog.open(AddStaffDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllStaff();
      }
    });
  }

  editStaff(staff: any) {
    const dialogRef = this.dialog.open(AddStaffDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: true,
        staff: staff
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllStaff();
      }
    });
  }

  deleteStaff(staff: any) {
    this.staffService.deleteStaff(staff.id).subscribe(
      (data) => {
        this.data = this.data.filter((s) => s.id !== staff.id);
        this.applyFilters();
        this.deleteError = null;
        if (this.rowSelected?.id === staff.id) {
          this.rowSelected = this.filteredData[0] || null;
        }
      },
      (error) => {
        console.log(error);
        this.deleteError = error;
      }
    );
  }

  printEntity() {
    window.print();
  }

  private staffTypeMap: { [key: string]: string } = {
    'ADMIN': 'مدير',
    'TECHNICAL': 'فني',
    'SUPERVISOR': 'مشرف',
  };

  getArabicStaffType(type: string | null | undefined): string {
    if (!type) return '';
    return this.staffTypeMap[type] || type;
  }

  getArabicGender(gender: string | null | undefined): string {
    if (!gender) return '';
    const map: { [key: string]: string } = { 'MALE': 'ذكر', 'FEMALE': 'أنثى' };
    return map[gender] || gender;
  }
}
