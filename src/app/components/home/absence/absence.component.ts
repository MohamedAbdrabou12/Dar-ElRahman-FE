// student-absent.component.ts
import {Component, inject, signal} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import {StudentAbsence} from "../../../models/StudentAbsence.model";
import {StudentAbsenceService} from "../../../services/absence/absence.service";
import {AddAbsenceDialogComponent} from "./add-student-absence-dialog/add-student-absence-dialog.component";
import {NgClass, NgIf} from "@angular/common";
import {ConfirmDialogComponent} from "../../shared/confirmation/confirmation.component";
import {Period} from "../../../models/enums/Period.enum";
import {TeacherMaritalStatus} from "../../../models/enums/TeacherMaritalStatus.enum";
import {StudentMaritalStatus} from "../../../models/enums/StudentMaritalStatus.enum";

@Component({
  selector: 'app-absence',
  templateUrl: './absence.component.html',
  imports: [
    NgClass,
    NgIf
  ],
  styleUrls: ['./absence.component.scss']
})
export class AbsenceComponent {
  absences = signal<StudentAbsence[]>([]);
  dialog = inject(MatDialog);

  rowSelected: StudentAbsence | undefined;

  constructor(
    private absenceService: StudentAbsenceService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) {
    this.loadAbsences();
  }

  loadAbsences() {
    this.loadingService.startLoading();
    this.absenceService.getAllStudentAbsences().subscribe({
      next: (response) => {
        this.absences.set(response?.data);
        this.rowSelected = this.absences()?.[0];

        this.loadingService.stopLoading();
      },
      error: () => {
        this.alertService.error('فشل في تحميل الغيابات');
        this.loadingService.stopLoading();
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddAbsenceDialogComponent, {
      width: '480px', maxWidth: '95vw', height: '500px',
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
      width: '480px', maxWidth: '95vw' , height: '500px',
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

  private statusMap: { [key: string]: string } = {
    [StudentMaritalStatus.not_defined]: 'غير معروف',
    [StudentMaritalStatus.single_parents]: 'لديه والد',
    [StudentMaritalStatus.living_parents]: 'لديه والدان',
    [StudentMaritalStatus.orphan]: 'يتيم'
  };

  getArabicStatus(status: string | null | undefined): string {
    if (!status)
      return '';
    return this.statusMap[status] || status;
  }

  protected readonly Period = Period;
  protected readonly StudentMaritalStatus = StudentMaritalStatus;
}
