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

  searchTerm = '';
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
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getAllTuitions();
    this.buildTuitionForm();
    this.getNonTuitionStudents();
  }

  private getAllTuitions() {
    this.tuitionService.getAllTuitions(this.pageNo, this.pageSize).subscribe(
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
        console.error('Tuitions fetch failed', error);
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
      row.student?.fullName?.toLowerCase().includes(term) ||
      row.student?.nationalId?.toLowerCase().includes(term) ||
      row.id?.toString().includes(term)
    );
  }

  onSearchChange() {
    this.applySearch();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
    this.getAllTuitions();
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
        this.tuitionService.addTuition(result).subscribe({
          next: () => {
            this.getAllTuitions();
            this.getNonTuitionStudents();
          },
          error: (error) => {
            this.error = error;
          }
        });
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
        this.tuitionService.updateTuition(result).subscribe({
          next: () => {
            this.getAllTuitions();
          },
          error: (error) => {
            this.error = error;
          }
        });
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
