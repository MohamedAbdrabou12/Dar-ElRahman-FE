// student-absent.component.ts
import {Component, inject, signal} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import {StudentAbsence} from "../../../models/StudentAbsence.model";
import {StudentAbsenceService} from "../../../services/absence/absence.service";
import {AddAbsenceDialogComponent} from "./add-student-absence-dialog/add-student-absence-dialog.component";
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RingService} from '../../../services/ring/ring.service';
import {Ring} from '../../../models/Ring.model';
import {ConfirmDialogComponent} from "../../shared/confirmation/confirmation.component";
import {TeacherMaritalStatus} from "../../../models/enums/TeacherMaritalStatus.enum";
import {StudentMaritalStatus} from "../../../models/enums/StudentMaritalStatus.enum";
import {normalizeArabic} from '../../../utils/arabic-normalizer';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-absence',
  templateUrl: './absence.component.html',
  imports: [
    NgClass,
    NgIf,
    FormsModule,
    DatePipe,
    ReactiveFormsModule
  ],
  styleUrls: ['./absence.component.scss']
})
export class AbsenceComponent {
  absences = signal<StudentAbsence[]>([]);
  filteredAbsences = signal<StudentAbsence[]>([]);
  dialog = inject(MatDialog);

  filterForm!: FormGroup;
  showFilters = false;
  rings: Ring[] = [];
  today = new Date();
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  rowSelected: StudentAbsence | undefined;

  constructor(
    private fb: FormBuilder,
    private absenceService: StudentAbsenceService,
    private ringService: RingService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    protected authService: AuthService
  ) {
    this.filterForm = this.fb.group({
      studentName: [''],
      ringId: [null],
      absenceDate: ['']
    });
    this.loadAbsences();
    this.loadRings();
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadAbsences() {
    this.loadingService.startLoading();
    this.absenceService.getAllStudentAbsences(0, 10000).subscribe({
      next: (response) => {
        this.absences.set(response?.data);
        this.applyFilters();
        if (!this.rowSelected) {
          this.rowSelected = this.filteredAbsences()?.[0];
        }
        this.loadingService.stopLoading();
      },
      error: () => {
        this.alertService.error('فشل في تحميل الغيابات');
        this.loadingService.stopLoading();
      }
    });
  }

  private loadRings(): void {
    this.ringService.getAllRings().subscribe(
      (response: any) => { this.rings = response.data; },
      (error) => { console.error('Rings fetch failed', error); }
    );
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.filterForm.reset({
      studentName: '',
      ringId: null,
      absenceDate: ''
    });
  }

  applyFilters() {
    const data = this.absences();
    const filters = this.filterForm?.value;
    let filtered: any[];
    if (!filters) {
      filtered = data;
    } else {
      filtered = data.filter((row: any) => {
        const nameMatch = !filters.studentName || normalizeArabic(row.student?.fullName)?.toLowerCase().includes(normalizeArabic(filters.studentName.toLowerCase())) || row.studentId?.toString().includes(filters.studentName);
        const ringMatch = !filters.ringId || row.student?.ring?.id === Number(filters.ringId);
        let dateMatch = true;
        if (filters.absenceDate) {
          const itemDate = row.absenceDate;
          dateMatch = itemDate === filters.absenceDate;
        }
        return nameMatch && ringMatch && dateMatch;
      });
    }
    this.filteredAbsences.set(filtered);
    this.totalRecords = filtered.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.pageNo >= this.totalPages) this.pageNo = 0;
  }

  get paginatedAbsences() {
    const data = this.filteredAbsences();
    if (!data) return [];
    const start = this.pageNo * this.pageSize;
    return data.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddAbsenceDialogComponent, {
      width: '500px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        mode: 'create',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAbsences();
    });
  }

  openEditDialog(absence: StudentAbsence) {
    const dialogRef = this.dialog.open(AddAbsenceDialogComponent, {
      width: '500px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {
        mode: 'edit',
        details: absence
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAbsences();
    });
  }

  deleteAbsence(absence: StudentAbsence) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px', height: '200px',
      data: {
        title: 'تأكيد الحذف',
        message: 'هل أنت متأكد أنك تريد حذف الغياب للطالب ؟'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.absenceService.deleteStudentAbsence({id: absence.id, studentId: absence.studentId}).subscribe({
          next: () => {
            this.absences.update(list => list.filter(a => a.id !== absence.id));
            this.alertService.success('تم الحذف بنجاح');
          },
          error: () => {
            this.alertService.error('فشل في الحذف');
          }
        });
      }
    });
  }

  selectRow(absence: StudentAbsence) {
    this.rowSelected = absence;
  }

  isStatus(status: any, value: string): status is string {
    return typeof status === 'string' && status === value;
  }

  printEntity() {
    window.print();
  }

  private statusMap: { [key: string]: string } = {
    [StudentMaritalStatus.single_parents]: 'لديه والد',
    [StudentMaritalStatus.living_parents]: 'لديه والدان',
    [StudentMaritalStatus.orphan]: 'يتيم'
  };

  getArabicStatus(status: string | null | undefined): string {
    if (!status)
      return '';
    return this.statusMap[status] || status;
  }
}
