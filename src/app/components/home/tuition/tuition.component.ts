import {CommonModule} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Modal} from 'bootstrap';
import {Tuition} from "../../../models/Tuition.model";
import {Grade} from "../../../models/enums/Grade.enum";
import {StudentService} from "../../../services/student/student.service";
import {Student} from "../../../models/Student.model";
import {TuitionService} from "../../../services/tuition/tuition.service";

@Component({
  selector: 'app-tuition',
  templateUrl: './tuition.component.html',
  styleUrls: ['./tuition.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class TuitionComponent implements OnInit {
  @ViewChild('tuitionModal') tuitionModal!: ElementRef;
  private modalInstance: Modal | null = null;

  data: Tuition[] = [];
  rowSelected: Tuition | undefined;
  students: Student[] = [];
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
    this.tuitionService.getAllTuitions().subscribe(
      (response: any) => {
        this.data = response.data;
        this.rowSelected = this.data[0];
      },
      (error) => {
        console.error('Tuitions fetch failed', error);
      }
    );
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

  onSubmit() {
    if (this.buttonName === 'إضافة') {
      this.tuitionService.addTuition(this.tuitionForm?.value).subscribe(
        (response) => {
          this.getAllTuitions();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    } else {
      this.tuitionService.updateTuition(this.tuitionForm?.value).subscribe(
        (response) => {
          this.getAllTuitions();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    }
  }

  reset() {
    this.tuition = {
      tuitionAmount: 0.0,
      tuitionDate: new Date(),
      studentId: undefined
    };
    this.buttonName = 'إضافة';
  }

  handleAddClick() {
    this.reset();
    this.buildTuitionForm();
  }

  editTuition(tuition: Tuition) {
    this.tuition = {...tuition};
    this.tuitionForm?.patchValue({
      id: this.tuition.id,
      tuitionAmount: this.tuition.tuitionAmount,
      tuitionDate: this.tuition.tuitionDate,
      studentId: this.tuition.student?.id,
    });
    this.buttonName = 'تعديل';
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

  ngAfterViewInit() {
    if (this.tuitionModal) {
      this.modalInstance = new Modal(this.tuitionModal.nativeElement);
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

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  protected readonly Grade = Grade;
}
