import { CommonModule, NgClass } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { StudentService } from 'src/app/services/student/student.service';
import { RingService } from 'src/app/services/ring/ring.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import {AlertService} from "../../../services/alert.service";
import {Student} from "../../../models/Student.model";
import { SurahsService } from 'src/app/services/surahs/surahs.service';
import {Surah} from "../../../models/Surah.model";

@Component({
  selector: 'app-surahs',
  standalone: true,
  templateUrl: './surahs.component.html',
  styleUrls: ['./surahs.component.scss'],
  imports: [NgClass, FormsModule, CommonModule],
})
export class SurahsComponent implements OnInit {
  error: any;
  periods: any[] = [
    { name: 'First', nameAR: 'الأولى' },
    { name: 'Second', nameAR: 'الثانية' },
    { name: 'Extended', nameAR: 'ممتدة' },
    { name: 'NOT_DEFINED', nameAR: 'غير معروف' },
  ];
  data = signal<any[] | undefined>(undefined);
  teachers = signal<any[] | undefined>(undefined);
  rings = signal<any[] | undefined>(undefined);
  surahs = signal<Surah[] | undefined>(undefined);

  rowSelected: any;

  dialog = inject(MatDialog);

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private ringService: RingService,
    private surahsService: SurahsService,
    private alertService: AlertService,
    protected loadingService: LoadingService,
  ) {
    effect(() => {
      if (this.data() && this.teachers() && this.rings() && this.surahs())
        this.loadingService.stopLoading();
    });
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.getAllSurahs();
    this.getAllStudents();
    this.gatAllRings();
    this.getAllTeachers();
  }

  private getAllSurahs() {
    this.surahsService.getAllSurahs().subscribe(
      (response: any) => {
        this.surahs.set(response.data);
      },
      (error) => {
        this.alertService.error('هناك خطأ. الرجاء المحاولة مرة أخرى.');
        this.loadingService.stopLoading();
      }
    );
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
}
