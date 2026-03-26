import {CommonModule, NgClass} from '@angular/common';
import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TeacherService} from 'src/app/services/teacher/teacher.service';
import {StudentService} from 'src/app/services/student/student.service';
import {RingService} from 'src/app/services/ring/ring.service';
import {LoadingService} from 'src/app/services/loading.service';
import {AddStudentDialogComponent} from './add-student-dialog/add-student-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from "../../../services/alert.service";
import {Student} from "../../../models/Student.model";
import {QuestionDialogComponent} from './question-dialog/question-dialog.component';
import {CertificateDialogComponent} from './certificate-dialog/certificate-dialog.component';
import {SurahsService} from 'src/app/services/surahs/surahs.service';
import {Period} from "../../../models/Period.model";
import {Surah} from "../../../models/Surah.model";
import {StudentMaritalStatus} from "../../../models/enums/StudentMaritalStatus.enum";
import {PeriodService} from '../../../services/period/period.service';

@Component({
  selector: 'app-student',
  standalone: true,
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  imports: [NgClass, FormsModule, CommonModule],
})
export class StudentComponent implements OnInit {
  error: any;
  periods = signal<any[] | undefined>(undefined);
  data = signal<any[] | undefined>(undefined);
  filteredData = signal<any[] | undefined>(undefined);
  teachers = signal<any[] | undefined>(undefined);
  rings = signal<any[] | undefined>(undefined);
  surahs = signal<Surah[] | undefined>(undefined);

  searchTerm = '';
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  rowSelected: any;
  today = new Date();

  dialog = inject(MatDialog);

  constructor(
    private teacherService: TeacherService,
    private ringService: RingService,
    private studentService: StudentService,
    private periodService: PeriodService,
    private alertService: AlertService,
    private surahsService: SurahsService,
    protected loadingService: LoadingService,
  ) {
    effect(() => {
      if (this.data() && this.teachers() && this.rings())
        this.loadingService.stopLoading();
    });
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.getAllStudents();
    this.gatAllRings();
    this.getAllTeachers();
    this.getAllPeriods();
  }


  private getAllStudents() {
    this.studentService.getAllStudent(this.pageNo, this.pageSize).subscribe(
      (response: any) => {
        this.data.set(response.data);
        this.totalRecords = response.totalRecords;
        this.totalPages = response.totalPages;
        this.applySearch();
        if (!this.rowSelected) {
          this.rowSelected = this.filteredData()?.[0];
        }
      },
      (error) => {
        this.loadingService.stopLoading();
        console.error('Student failed', error);
      }
    );
  }

  applySearch() {
    const data = this.data();
    if (!data) {
      this.filteredData.set(undefined);
      return;
    }
    if (!this.searchTerm.trim()) {
      this.filteredData.set(data);
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredData.set(
      data.filter((row: any) =>
        row.fullName?.toLowerCase().includes(term) ||
        row.nationalId?.toLowerCase().includes(term) ||
        row.id?.toString().includes(term) ||
        row.ring?.teacherName?.toLowerCase().includes(term)
      )
    );
  }

  onSearchChange() {
    this.applySearch();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageNo = page;
    this.getAllStudents();
  }

  selectRow(row: any) {
    this.rowSelected = row;
  }

  private getAllTeachers() {
    this.teacherService.getAllTeachers().subscribe(
      (response) => {
        this.teachers.set(response.data);
      },
      (error) => {
        this.alertService.error('هناك خطأ. الرجاء المحاولة مرة أخرى.');
        this.loadingService.stopLoading();
      }
    );
  }

  private gatAllRings() {
    this.ringService.getAllRings().subscribe(
      (response) => {
        this.rings.set(response.data);
      },
      (error) => {
        this.alertService.error('هناك خطأ. الرجاء المحاولة مرة أخرى.');
        this.loadingService.stopLoading();
        console.error('Rings failed', error);
      }
    );
  }

  private getAllPeriods() {
    this.periodService.getAllPeriods().subscribe(
      (response) => {
        this.periods.set(response.data);
      },
      (error) => {
        this.alertService.error('هناك خطأ. الرجاء المحاولة مرة أخرى.');
        console.error('Periods failed', error);
      }
    );
  }

  private getCompletedSurahsByStudentId(studentId: number) {
    this.studentService.getCompletedSurahsByStudentId(studentId).subscribe(
      (response: any) => {
        this.surahs.set(response.data);
      },
      (error) => {
        this.alertService.error('هناك خطأ. الرجاء المحاولة مرة أخرى.');
        this.loadingService.stopLoading();
      }
    );
  }


  handleEditClick(student: any) {
    const studentData = this.cloneStudent(student);
    // Map the period from ring to match the periods array
    studentData.periodName = student.ring?.period || student.periodName;

    this.openAddStudentDialog(studentData);
  }

  deleteStudent(student: any) {
    this.loadingService.startLoading();
    this.studentService.deleteStudent(student.id).subscribe(
      (data) => {
        let filteredData = this.data()?.filter(
          (studnt) => studnt.id !== student.id
        );
        this.data.set(filteredData);
        this.loadingService.stopLoading();
      },
      (error) => {
        console.log(error);
        this.loadingService.stopLoading();
      }
    );
  }

  cloneStudent(student: any): any {
    return {
      id: student.id,
      fullName: student.fullName,
      nationalId: student.nationalId,
      motherName: student.motherName,
      address: student.address,
      motherPhoneNumber: student.motherPhoneNumber,
      maritalStatus: student.maritalStatus,
      periodName: student.ring.period,
      ringId: student.ringId,
      joiningDate: student.joiningDate,
      birthDate: student.birthDate,
      fatherPhoneNumber: student.fatherPhoneNumber,
      fatherEmailAddress: student.fatherEmailAddress,
      status: student.status,
      gender: student.gender,
      profilePictureUrl: student.profilePictureUrl,
    };
  }

  openAddStudentDialog(student?: Student) {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {student: student, periods: this.periods(), rings: this.rings()}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllStudents();
      }
    });
  }

  openQuestionDialog(studentId: number) {
    this.getCompletedSurahsByStudentId(studentId);
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      direction: 'rtl',
      data: {studentId: studentId, surahs: this.surahs()}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle result if needed
      }
    });
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

  getArabicGender(gender: string | null | undefined): string {
    if (!gender) return '';
    const map: { [key: string]: string } = { 'MALE': 'ذكر', 'FEMALE': 'أنثى' };
    return map[gender] || gender;
  }

  openCertificateDialog(student: any): void {
    this.dialog.open(CertificateDialogComponent, {
      width: '1200px',
      maxWidth: '98vw',
      maxHeight: '95vh',
      direction: 'rtl',
      data: { student: student }
    });
  }
}
