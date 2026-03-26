import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutes } from '../../constants/app-routes';
import { LoadingComponent } from '../shared/loading/loading.component';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, LoadingComponent, ToastComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  public readonly AppRoutes = AppRoutes;

  /** User data model */
  user = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: [] as string[],
  };

  /** Show/hide password fields */
  showPassword = false;
  showConfirmPassword = false;

  showRoles = false;

  /** Toast handler */
  toast: { message: string; type: 'success' | 'error' | 'warning' | 'info' } | null = null;

  /** References to form fields for focus control */
  @ViewChild('fullNameInput') fullNameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    protected loadingService: LoadingService
  ) {}

  /** Detect clicks outside dropdown to close it */
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (
      this.showRoles &&
      this.dropdownContainer &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      this.showRoles = false;
    }
  }

  /** Toast utility function */
  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3000);
  }

  /** Focus and highlight invalid field */
  private highlightField(ref: ElementRef | undefined) {
    if (!ref) return;
    const el = ref.nativeElement as HTMLElement;
    el.classList.add('border-red-500', 'animate-shake');
    el.focus();

    // Remove red border after few seconds
    setTimeout(() => {
      el.classList.remove('border-red-500', 'animate-shake');
    }, 1500);
  }

  /** Toggle user roles */
  toggleRole(role: string) {
    const index = this.user.roles.indexOf(role);
    if (index > -1) {
      this.user.roles.splice(index, 1);
    } else {
      this.user.roles.push(role);
    }
  }

  /** Validate form fields before submitting */
  private validateForm(form: NgForm): boolean {
    if (!this.user.fullName.trim()) {
      this.showToast('يرجى إدخال الاسم الكامل 🧾', 'warning');
      this.highlightField(this.fullNameInput);
      return false;
    }

    if (!this.user.email.trim()) {
      this.showToast('يرجى إدخال البريد الإلكتروني 📧', 'warning');
      this.highlightField(this.emailInput);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.showToast('صيغة البريد الإلكتروني غير صحيحة 📭', 'error');
      this.highlightField(this.emailInput);
      return false;
    }

    if (!this.user.password) {
      this.showToast('يرجى إدخال كلمة المرور 🔒', 'warning');
      this.highlightField(this.passwordInput);
      return false;
    }

    if (this.user.password.length < 6) {
      this.showToast('كلمة المرور يجب أن تكون على الأقل 6 أحرف 🔑', 'warning');
      this.highlightField(this.passwordInput);
      return false;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.showToast('كلمتا المرور غير متطابقتين ❌', 'error');
      this.highlightField(this.confirmPasswordInput);
      return false;
    }

    if (this.user.roles.length === 0) {
      this.showToast('يجب اختيار دور واحد على الأقل 👤', 'warning');
      this.showRoles = true;
      return false;
    }

    return true;
  }

  /** Form submission with validation */
  onSubmit(form: NgForm) {
    if (!this.validateForm(form)) return;

    this.loadingService.startLoading();

    this.authService.register(this.user).subscribe(
      (response: any) => {
        console.log('Register response', response);
        localStorage.setItem('token', response.data.token);
        this.loadingService.stopLoading();

        this.showToast('تم إنشاء الحساب بنجاح 🎉', 'success');
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      (error) => {
        console.error('Registration failed', error);
        this.loadingService.stopLoading();

        if (error?.error?.message?.includes('email')) {
          this.showToast('هذا البريد مسجل بالفعل 🚫', 'error');
          this.highlightField(this.emailInput);
        } else {
          this.showToast('حدث خطأ أثناء التسجيل، حاول مرة أخرى ⚠️', 'error');
        }
      }
    );
  }
}


