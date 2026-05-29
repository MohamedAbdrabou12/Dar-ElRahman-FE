// student-absent.component.ts
import {Component, inject, signal} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import {StudentAbsence} from "../../../models/StudentAbsence.model";
import {StudentAbsenceService} from "../../../services/absence/absence.service";
import {AddAbsenceDialogComponent} from "./add-student-absence-dialog/add-student-absence-dialog.component";
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
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
    DatePipe
  ],
  styleUrls: ['./absence.component.scss']
})
export class AbsenceComponent {
  absences = signal<StudentAbsence[]>([]);
  filteredAbsences = signal<StudentAbsence[]>([]);
  dialog = inject(MatDialog);

  searchTerm = '';
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  rowSelected: StudentAbsence | undefined;

  constructor(
    private absenceService: StudentAbsenceService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    protected authService: AuthService
  ) {
    this.loadAbsences();
  }

  loadAbsences() {
    this.loadingService.startLoading();
    this.absenceService.getAllStudentAbsences(this.pageNo, this.pageSize).subscribe({
      next: (response) => {
        this.absences.set(response?.data);
        this.totalRecords = response.totalRecords ?? response.data?.length ?? 0;
        this.totalPages = Math.max(response.totalPages ?? 0, Math.ceil(this.totalRecords / this.pageSize));
        this.applySearch();
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

  applySearch() {
    const data = this.absences();
    if (!this.searchTerm.trim()) {
      this.filteredAbsences.set(data);
      return;
    }
    const term = normalizeArabic(this.searchTerm.toLowerCase());
    this.filteredAbsences.set(
      data.filter((row: any) =>
        normalizeArabic(row.student?.fullName)?.toLowerCase().includes(term) ||
        row.studentId?.toString().includes(term) ||
        normalizeArabic(row.student?.ring?.name)?.toLowerCase().includes(term) ||
        row.absenceDate?.toLowerCase().includes(term)
      )
    );
  }

  onSearchChange() {
    this.applySearch();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
    this.loadAbsences();
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
