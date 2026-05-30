import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Tuition} from "../../../models/Tuition.model";
import {Grade} from "../../../models/enums/Grade.enum";
import {StudentService} from "../../../services/student/student.service";
import {Student} from "../../../models/Student.model";
import {TuitionService} from "../../../services/tuition/tuition.service";
import {MatDialog} from "@angular/material/dialog";
import {AddTuitionDialogComponent} from "./add-tuition-dialog/add-tuition-dialog.component";
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-tuition',
  templateUrl: './tuition.component.html',
  styleUrls: ['./tuition.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class TuitionComponent implements OnInit {
  private dialog = inject(MatDialog);

  data: Tuition[] = [];
  filteredData: Tuition[] = [];
  rowSelected: Tuition | undefined;
  students: Student[] = [];
  today = new Date();

  filterForm!: FormGroup;
  showFilters = false;
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  buttonName = 'إضافة';
  tuition: Tuition = {
    tuitionAmount: 0.0,
    tuitionDate: new Date(),
    studentId: undefined,
  };

  error: any;
  deleteError: any;
  tuitionForm: FormGroup | undefined;

  constructor(
    private studentService: StudentService,
    private tuitionService: TuitionService,
    private fb: FormBuilder,
    protected authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      studentName: [''],
      paymentStatus: [null],
      tuitionMonth: ['']
    });
    this.getAllTuitions();
    this.buildTuitionForm();
    this.getNonTuitionStudents();
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private getAllTuitions() {
    this.tuitionService.getAllTuitions(0, 10000).subscribe(
      (response: any) => {
        this.data = response.data;
        this.applyFilters();
        if (!this.rowSelected) {
          this.rowSelected = this.filteredData[0];
        }
      },
      (error) => {
        console.error('Tuitions fetch failed', error);
      }
    );
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.filterForm.reset({
      studentName: '',
      paymentStatus: null,
      tuitionMonth: ''
    });
  }

  applyFilters() {
    const filters = this.filterForm?.value;
    if (!filters) {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter((row: any) => {
        const nameMatch = !filters.studentName || row.student?.fullName?.toLowerCase().includes(filters.studentName.toLowerCase()) || row.student?.nationalId?.toLowerCase().includes(filters.studentName.toLowerCase());
        let statusMatch = true;
        if (filters.paymentStatus === 'exempted') statusMatch = row.exempted === true;
        else if (filters.paymentStatus === 'paid') statusMatch = !row.exempted && row.paid === true;
        else if (filters.paymentStatus === 'unpaid') statusMatch = !row.exempted && !row.paid;
        let monthMatch = true;
        if (filters.tuitionMonth) {
          const itemMonth = row.tuitionMonth ? new Date(row.tuitionMonth).toISOString().substring(0, 7) : '';
          monthMatch = itemMonth === filters.tuitionMonth;
        }
        return nameMatch && statusMatch && monthMatch;
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

  private getNonTuitionStudents() {
    this.studentService.getNonTuitionStudents().subscribe(
      (response: any) => {
        this.students = response.data;
      },
      (error) => {
        console.error('Non tuition students fetch failed', error);
      }
    );
  }

  buildTuitionForm() {
    this.tuitionForm = this.fb.group({
      id: [null],
      tuitionAmount: [0.0, Validators.required],
      tuitionDate: [new Date(), Validators.required],
      studentId: ['', Validators.required],
    });
  }

  selectRow(row: any) {
    this.rowSelected = row;
  }


  handleAddClick() {
    const dialogRef = this.dialog.open(AddTuitionDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: false,
        students: this.students
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllTuitions();
        this.getNonTuitionStudents();
      }
    });
  }

  editTuition(tuition: Tuition) {
    const dialogRef = this.dialog.open(AddTuitionDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: true,
        tuition: tuition,
        students: this.students
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllTuitions();
      }
    });
  }

  deleteTuition(tuition: Tuition) {
    this.tuitionService.deleteTuition(tuition.id!).subscribe(
      (data) => {
        this.data = this.data.filter((q) => q.id !== tuition.id);
        this.deleteError = null;
        if (this.rowSelected?.id === tuition.id) {
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

  protected readonly Grade = Grade;
}
