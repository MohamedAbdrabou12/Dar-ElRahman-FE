import {CommonModule} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {RingService} from 'src/app/services/ring/ring.service';
import {TeacherService} from 'src/app/services/teacher/teacher.service';
import {Modal} from 'bootstrap';
import {Ring} from 'src/app/models/Ring.model';
import {Teacher} from 'src/app/models/Teacher.model';
import {Period} from "../../../models/enums/Period.enum";
import {MemorizationPart} from "../../../models/enums/MemorizationPart.enum";

@Component({
  selector: 'app-ring',
  templateUrl: './ring.component.html',
  styleUrls: ['./ring.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class RingComponent implements OnInit {
  @ViewChild('ringModal') ringModal!: ElementRef; // Reference to the modal
  private modalInstance: Modal | null = null;

  data: Ring[] = [];
  rowSelected: Ring | undefined;
  buttonName = 'إضافة';
  ring: Ring = {
    name: '',
    studentCount: 0,
    period: Period.first,
    memorizationPart: MemorizationPart.page,
    teacherId: 0,
    teacherName: ''
  };
  error: any;
  deleteError: any;
  teachers: Teacher[] = [];

  ringForm: FormGroup | undefined;

  constructor(
    private ringService: RingService,
    private teacherService: TeacherService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getAllRings();
    this.getAllTeachers();
    this.buildRingForm();
  }

  private getAllRings() {
    this.ringService.getAllRings().subscribe(
      (response: any) => {
        this.data = response.data;
        this.rowSelected = this.data[0];
        console.log("Rings retrieved from backend are", this.data)
      },
      (error) => {
        console.error('Rings fetch failed', error);
      }
    );
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
      studentCount: [0, Validators.required],
      period: [Period.first, Validators.required],
      memorizationPart: [MemorizationPart.page, Validators.required],
      teacherId: [null, Validators.required],
    });
  }

  selectRow(row: any) {
    this.rowSelected = row;
  }

  onSubmit() {
    if (this.buttonName === 'إضافة') {
      this.ringService.addRing(this.ringForm?.value).subscribe(
        (response) => {
          this.getAllRings();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    } else {
      this.ringService.updateRing(this.ringForm?.value).subscribe(
        (response) => {
          this.getAllRings();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    }
  }

  reset() {
    this.ring = {
      name: '',
      period: Period.first,
      memorizationPart: MemorizationPart.page,
      studentCount: 0,
      teacherId: 0,
      teacherName: ''
    };
    this.buttonName = 'إضافة';
  }

  handleAddClick() {
    this.reset();
    this.buildRingForm();
  }

  editRing(ring: Ring) {
    this.ring = {...ring};
    this.ringForm?.patchValue({
      id: this.ring.id,
      name: this.ring.name,
      period: this.ring.period,
      studentCount: this.ring.studentCount,
      memorizationPart: this.ring.memorizationPart,
      teacherId: this.ring.teacherId,
    });
    this.buttonName = 'تعديل';
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

  ngAfterViewInit() {
    if (this.ringModal) {
      this.modalInstance = new Modal(this.ringModal.nativeElement);
    }
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

  protected readonly Period = Period;
  protected readonly MemorizationPart = MemorizationPart;
}
