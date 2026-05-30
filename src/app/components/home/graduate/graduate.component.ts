import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {GraduateService} from 'src/app/services/graduate/graduate.service';
import {Graduate} from "../../../models/Graduate.model";
import {Grade} from "../../../models/enums/Grade.enum";
import {StudentService} from "../../../services/student/student.service";
import {Student} from "../../../models/Student.model";
import {MatDialog} from "@angular/material/dialog";
import {AddGraduateDialogComponent} from "./add-graduate-dialog/add-graduate-dialog.component";
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-graduate',
  templateUrl: './graduate.component.html',
  styleUrls: ['./graduate.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class GraduateComponent implements OnInit {
  private dialog = inject(MatDialog);

  data: Graduate[] = [];
  filteredData: Graduate[] = [];
  rowSelected: Graduate | undefined;
  students: Student[] = [];

  filterForm!: FormGroup;
  showFilters = false;
  today = new Date();
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  grades: string[] = Object.values(Grade);
  buttonName = 'إضافة';
  graduate: Graduate = {
    finalGrade: Grade.excellent,
    completionDate: new Date(),
    studentId: undefined,
  };

  error: any;
  deleteError: any;
  graduateForm: FormGroup | undefined;

  constructor(
    private studentService: StudentService,
    private graduateService: GraduateService,
    private fb: FormBuilder,
    protected authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      studentName: [''],
      finalGrade: [null],
      completionDate: ['']
    });
    this.getAllGraduates();
    this.buildGraduateForm();
    this.getNonGraduateStudents();
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private getAllGraduates() {
    this.graduateService.getAllGraduates(0, 10000).subscribe(
      (response: any) => {
        this.data = response.data;
        this.applyFilters();
        if (!this.rowSelected) {
          this.rowSelected = this.filteredData[0];
        }
      },
      (error) => {
        console.error('Graduates fetch failed', error);
      }
    );
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.filterForm.reset({
      studentName: '',
      finalGrade: null,
      completionDate: ''
    });
  }

  applyFilters() {
    const filters = this.filterForm?.value;
    if (!filters) {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter((row: any) => {
        const nameMatch = !filters.studentName || row.student?.fullName?.toLowerCase().includes(filters.studentName.toLowerCase()) || row.student?.nationalId?.toLowerCase().includes(filters.studentName.toLowerCase());
        const gradeMatch = !filters.finalGrade || row.finalGrade === filters.finalGrade;
        let dateMatch = true;
        if (filters.completionDate) {
          const itemDate = row.completionDate ? new Date(row.completionDate).toISOString().split('T')[0] : '';
          dateMatch = itemDate === filters.completionDate;
        }
        return nameMatch && gradeMatch && dateMatch;
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

  private getNonGraduateStudents() {
    this.studentService.getNonGraduateStudents().subscribe(
      (response: any) => {
        this.students = response.data;
      },
      (error) => {
        console.error('Non graduate students fetch failed', error);
      }
    );
  }

  buildGraduateForm() {
    this.graduateForm = this.fb.group({
      id: [null],
      finalGrade: [Grade.excellent, Validators.required],
      completionDate: [new Date(), Validators.required],
      studentId: ['', Validators.required],
    });
  }

  selectRow(row: any) {
    this.rowSelected = row;
  }


  handleAddClick() {
    const dialogRef = this.dialog.open(AddGraduateDialogComponent, {
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
        this.getAllGraduates();
        this.getNonGraduateStudents();
      }
    });
  }

  editGraduate(graduate: Graduate) {
    const dialogRef = this.dialog.open(AddGraduateDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        isEdit: true,
        graduate: graduate,
        students: this.students
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllGraduates();
      }
    });
  }

  deleteGraduate(graduate: Graduate) {
    this.graduateService.deleteGraduate(graduate.id!).subscribe(
      (data) => {
        this.data = this.data.filter((q) => q.id !== graduate.id);
        this.deleteError = null;
        if (this.rowSelected?.id === graduate.id) {
          this.rowSelected = undefined;
        }
      },
      (error) => {
        this.deleteError = error;
      }
    );
  }


  getAgeAtCompletion(birthDateInput: string | Date | undefined, completionDateInput: string | Date | undefined): number {
    if (!birthDateInput || !completionDateInput) {
      throw new Error("Invalid date format."); // or throw an error if these are required
    }

    const birthDate = new Date(birthDateInput);
    const completionDate = new Date(completionDateInput);

    if (isNaN(birthDate.getTime()) || isNaN(completionDate.getTime())) {
      throw new Error("Invalid date format.");
    }

    if (completionDate < birthDate) {
      throw new Error("Completion date cannot be before birth date.");
    }

    let age = completionDate.getFullYear() - birthDate.getFullYear();

    // Adjust if completion date is before the birthday in that year
    const hasHadBirthday =
      completionDate.getMonth() > birthDate.getMonth() ||
      (completionDate.getMonth() === birthDate.getMonth() &&
        completionDate.getDate() >= birthDate.getDate());

    if (!hasHadBirthday) {
      age--;
    }

    return age;
  }

  private gradeMap: { [key: string]: string } = {
    [Grade.excellent]: 'ممتاز',
    [Grade.very_good]: 'جيد جدا',
    [Grade.good]: 'جيد'
  };

  getArabicGrade(grade: string | null | undefined): string {
    if (!grade)
      return '';
    return this.gradeMap[grade] || grade;
  }


  printEntity() {
    window.print();
  }

  protected readonly Grade = Grade;
}
