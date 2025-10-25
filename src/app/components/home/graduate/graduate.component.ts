import {CommonModule} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Modal} from 'bootstrap';
import {GraduateService} from 'src/app/services/graduate/graduate.service';
import {Graduate} from "../../../models/Graduate.model";
import {Grade} from "../../../models/enums/Grade.enum";
import {StudentService} from "../../../services/student/student.service";
import {Student} from "../../../models/Student.model";

@Component({
  selector: 'app-graduate',
  templateUrl: './graduate.component.html',
  styleUrls: ['./graduate.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class GraduateComponent implements OnInit {
  @ViewChild('graduateModal') graduateModal!: ElementRef;
  private modalInstance: Modal | null = null;

  data: Graduate[] = [];
  rowSelected: Graduate | undefined;
  students: Student[] = [];
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
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getAllGraduates();
    this.buildGraduateForm();
    this.getNonGraduateStudents();
  }

  private getAllGraduates() {
    this.graduateService.getAllGraduates().subscribe(
      (response: any) => {
        this.data = response.data;
        this.rowSelected = this.data[0];
      },
      (error) => {
        console.error('Graduates fetch failed', error);
      }
    );
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

  onSubmit() {
    if (this.buttonName === 'إضافة') {
      this.graduateService.addGraduate(this.graduateForm?.value).subscribe(
        (response) => {
          this.getAllGraduates();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    } else {
      this.graduateService.updateGraduate(this.graduateForm?.value).subscribe(
        (response) => {
          this.getAllGraduates();
          this.closeModal();
        },
        (error) => {
          this.error = error;
        }
      );
    }
  }

  reset() {
    this.graduate = {
      finalGrade: Grade.excellent,
      completionDate: new Date(),
      studentId: undefined
    };
    this.buttonName = 'إضافة';
  }

  handleAddClick() {
    this.reset();
    this.buildGraduateForm();
  }

  editGraduate(graduate: Graduate) {
    this.graduate = {...graduate};
    this.graduateForm?.patchValue({
      id: this.graduate.id,
      finalGrade: this.graduate.finalGrade,
      completionDate: this.graduate.completionDate,
      studentId: this.graduate.student?.id,
    });
    this.buttonName = 'تعديل';
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

  ngAfterViewInit() {
    if (this.graduateModal) {
      this.modalInstance = new Modal(this.graduateModal.nativeElement);
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

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  protected readonly Grade = Grade;
}
