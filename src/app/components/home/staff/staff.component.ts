import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StaffService} from 'src/app/services/staff/staff.service';
import {MatDialog} from '@angular/material/dialog';
import {AddStaffDialogComponent} from './add-staff-dialog/add-staff-dialog.component';

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

  searchTerm = '';
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  error: any;
  deleteError: any;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.getAllStaff();
  }

  private getAllStaff() {
    this.staffService.getAllStaff(this.pageNo, this.pageSize).subscribe(
      (response: any) => {
        this.data = response.data;
        this.totalRecords = response.totalRecords;
        this.totalPages = response.totalPages;
        this.applySearch();
        if (!this.rowSelected) {
          this.rowSelected = this.filteredData[0];
        }
      },
      (error) => {
        console.error('Staff fetch failed', error);
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
      row.fullName?.toLowerCase().includes(term) ||
      row.nationalId?.toLowerCase().includes(term) ||
      row.id?.toString().includes(term) ||
      row.phoneNumber?.toLowerCase().includes(term)
    );
  }

  onSearchChange() {
    this.applySearch();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
    this.getAllStaff();
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
        this.applySearch();
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
