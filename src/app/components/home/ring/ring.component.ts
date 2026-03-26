import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {RingService} from 'src/app/services/ring/ring.service';
import {TeacherService} from 'src/app/services/teacher/teacher.service';
import {Ring} from 'src/app/models/Ring.model';
import {Teacher} from 'src/app/models/Teacher.model';
import {Period} from 'src/app/models/Period.model';
import {MemorizationPart} from "../../../models/enums/MemorizationPart.enum";
import {MatDialog} from "@angular/material/dialog";
import {AddRingDialogComponent} from "./add-ring-dialog/add-ring-dialog.component";
import {PeriodService} from '../../../services/period/period.service';

@Component({
  selector: 'app-ring',
  templateUrl: './ring.component.html',
  styleUrls: ['./ring.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class RingComponent implements OnInit {
  private dialog = inject(MatDialog);

  data: Ring[] = [];
  filteredData: Ring[] = [];
  rowSelected: Ring | undefined;
  today = new Date();

  searchTerm = '';
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  buttonName = 'إضافة';
  ring: Ring = {
    name: '',
    periodId: 0,
    memorizationPart: MemorizationPart.page,
    teacherId: 0,
    teacherName: ''
  };
  error: any;
  deleteError: any;
  teachers: Teacher[] = [];
  periods: Period[] = [];

  ringForm: FormGroup | undefined;

  constructor(
    private ringService: RingService,
    private teacherService: TeacherService,
    private periodService: PeriodService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getAllRings();
    this.getAllTeachers();
    this.getAllPeriods();
    this.buildRingForm();
  }

  private getAllRings() {
    this.ringService.getAllRings(this.pageNo, this.pageSize).subscribe(
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
        console.error('Rings fetch failed', error);
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
      row.teacherName?.toLowerCase().includes(term) ||
      row.periodName?.toLowerCase().includes(term)
    );
  }

  onSearchChange() {
    this.applySearch();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
    this.getAllRings();
  }

  private getAllTeachers() {
    this.teacherService.getAllTeachers().subscribe(
      (response: any) => {
        this.teachers = response.data;
      },
      (error) => {
        console.error('Teachers fetch failed', error);
      }
    );
  }

  private getAllPeriods() {
    this.periodService.getAllPeriods().subscribe(
      (response: any) => {
        this.periods = response.data;
      },
      (error) => {
        console.error('Periods fetch failed', error);
      }
    );
  }

  buildRingForm() {
    this.ringForm = this.fb.group({
      id: [null],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(255),
        ],
      ],
      periodId: [null, Validators.required],
      memorizationPart: [MemorizationPart.page, Validators.required],
      teacherId: [null, Validators.required],
    });
  }

  selectRow(row: any) {
    this.rowSelected = row;
  }


  handleAddClick() {
    const dialogRef = this.dialog.open(AddRingDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: false,
        teachers: this.teachers,
        periods: this.periods
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ringService.addRing(result).subscribe({
          next: () => {
            this.getAllRings();
          },
          error: (error) => {
            this.error = error;
          }
        });
      }
    });
  }

  editRing(ring: Ring) {
    const dialogRef = this.dialog.open(AddRingDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: true,
        ring: ring,
        teachers: this.teachers,
        periods: this.periods
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ringService.updateRing(result).subscribe({
          next: () => {
            this.getAllRings();
          },
          error: (error) => {
            this.error = error;
          }
        });
      }
    });
  }

  deleteRing(ring: Ring) {
    this.ringService.deleteRing(ring.id!).subscribe(
      (data) => {
        this.data = this.data.filter((r) => r.id !== ring.id);
        this.deleteError = null;
        if (this.rowSelected?.id === ring.id) {
          this.rowSelected = undefined;
        }
      },
      (error) => {
        this.deleteError = error;
      }
    );
  }


  printEntity() {
    window.print();
  }

  private memorizationPartMap: { [key : string]: string } = {
    [MemorizationPart.juz]: 'جزء',
    [MemorizationPart.half_juz]: 'نصف جزء',
    [MemorizationPart.half_hizb]: 'نصف حزب',
    [MemorizationPart.quarter_hizb]: 'ربع حزب',
    [MemorizationPart.two_pages]: 'وجهين',
    [MemorizationPart.page]: 'وجه',
    [MemorizationPart.half_page]: 'نصف وجه',
    [MemorizationPart.five_lines]: 'خمسة أسطر',
    [MemorizationPart.three_lines]: 'ثلاثة أسطر'
  };

  getArabicMemorizationPart(grade: string | null | undefined): string {
    if (!grade)
      return '';
    return this.memorizationPartMap[grade] || grade;
  }

  protected readonly MemorizationPart = MemorizationPart;
}
