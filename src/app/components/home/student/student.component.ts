import {CommonModule, NgClass} from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TeacherService} from 'src/app/services/teacher/teacher.service';
import {StudentService} from 'src/app/services/student/student.service';
import {RingService} from 'src/app/services/ring/ring.service';
import {Modal} from 'bootstrap';
import {LoadingService} from 'src/app/services/loading.service';
import {AddStudentDialogComponent} from './add-student-dialog/add-student-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from "../../../services/alert.service";
import {Student} from "../../../models/Student.model";
import {QuestionDialogComponent} from './question-dialog/question-dialog.component';
import {SurahsService} from 'src/app/services/surahs/surahs.service';
import {Period} from "../../../models/enums/Period.enum";
import {Surah} from "../../../models/Surah.model";
import {StudentMaritalStatus} from "../../../models/enums/StudentMaritalStatus.enum";

@Component({
  selector: 'app-student',
  standalone: true,
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  imports: [NgClass, FormsModule, CommonModule],
})
export class StudentComponent implements OnInit {
  @ViewChild('studentModal', {static: false}) studentModal!: ElementRef;
  private modalInstance: Modal | null = null;
  buttonName = 'إضافة';
  student = {
    id: '',
    fullName: '',
    nationalId: '',
    motherName: '',
    address: '',
    motherPhoneNumber: '',
    maritalStatus: 'not_defined',
    periodName: '',
    ringId: 1,
    joiningDate: '',
    birthDate: '',
    fatherPhoneNumber: '',
    fatherEmailAddress: '',
    status: '',
  };
  error: any;
  periods: any[] = [
    {name: 'First', nameAR: 'الأولى'},
    {name: 'Second', nameAR: 'الثانية'},
    {name: 'Extended', nameAR: 'ممتدة'},
    {name: 'not_defined', nameAR: 'غير معروف'},
  ];
  data = signal<any[] | undefined>(undefined);
  teachers = signal<any[] | undefined>(undefined);
  rings = signal<any[] | undefined>(undefined);
  surahs = signal<Surah[] | undefined>(undefined);

  rowSelected: any;

  dialog = inject(MatDialog);

  constructor(
    private teacherService: TeacherService,
    private ringService: RingService,
    private studentService: StudentService,
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
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }

  private getAllStudents() {
    this.studentService.getAllStudent().subscribe(
      (response: any) => {
        this.data.set(response.data);
        this.rowSelected = this.data()?.[0];
      },
      (error) => {
        console.error('Student failed', error);
      }
    );
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

  onSubmit() {
    this.loadingService.startLoading();
    if (this.buttonName === 'إضافة') {
      this.studentService.addStudent(this.student).subscribe(
        (response) => {
          this.getAllStudents();
          this.closeModal();
        },
        (error) => {
          this.error = error;
          this.alertService.error('هناك خطأ. الرجاء المحاولة مرة أخرى.');
          this.loadingService.stopLoading();
        }
      );
    } else {
      this.studentService.updateStudent(this.student).subscribe(
        (response) => {
          this.getAllStudents();
          this.closeModal();
        },
        (error) => {
          this.alertService.error('هناك خطأ. الرجاء المحاولة مرة أخرى.');
          this.loadingService.stopLoading();
        }
      );
    }
  }

  reset() {
    this.student = {
      id: '',
      fullName: '',
      nationalId: '',
      motherName: '',
      address: '',
      motherPhoneNumber: '',
      maritalStatus: 'not_defined',
      periodName: '',
      ringId: 1,
      joiningDate: '',
      birthDate: '',
      fatherPhoneNumber: '',
      fatherEmailAddress: '',
      status: '',
    };
  }

  handleEditClick(student: any) {
    this.student = this.cloneStudent(student);
    console.log('Filter', student.ring.period);

    this.student.periodName = this.periods
      .filter((p) => p.nameAR === student.ring.period)
      .map((p) => p.name)[0];

    this.buttonName = 'تعديل';
    if (!this.modalInstance) {
      this.modalInstance = new Modal(this.studentModal.nativeElement);
    }
    this.modalInstance.show();
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
    };
  }

  openAddStudentDialog(student?: Student) {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      // data: {name: this.name(), animal: this.animal()},\
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      data: {student: student, periods: this.periods, rings: this.rings()}
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getAllStudents();
      if (result !== undefined) {
      }
    });
  }

  openQuestionDialog(studentId: number) {
    this.getCompletedSurahsByStudentId(studentId);
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      data: {studentId: studentId, surahs: this.surahs()}
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
      }
    });
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
  protected StudentMaritalStatus = StudentMaritalStatus;
}
