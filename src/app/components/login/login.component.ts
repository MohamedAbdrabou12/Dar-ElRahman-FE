import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutes } from '../../constants/app-routes';
import { LoadingService } from 'src/app/services/loading.service';
import { LoadingComponent } from '../shared/loading/loading.component';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, LoadingComponent, ToastComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public readonly AppRoutes = AppRoutes;

  credentials = {
    email: '',
    password: '',
  };

  showPassword = false;

  toast: { message: string; type: 'success' | 'error' | 'warning' | 'info' } | null = null;

  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    protected loadingService: LoadingService
  ) {}

  /** Toast utility */
  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3000);
  }

  /** Highlight invalid field */
  private highlightField(ref: ElementRef | undefined) {
    if (!ref) return;
    const el = ref.nativeElement as HTMLElement;
    el.classList.add('border-red-500', 'animate-shake');
    el.focus();
    setTimeout(() => el.classList.remove('border-red-500', 'animate-shake'), 1500);
  }

  /** Validate email format */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /** Form submission */
  onSubmit(form: NgForm) {
    // Check email
    if (!this.credentials.email.trim()) {
      this.showToast('يرجى إدخال البريد الإلكتروني 📧', 'warning');
      this.highlightField(this.usernameInput);
      return;
    }

    if (!this.validateEmail(this.credentials.email)) {
      this.showToast('صيغة البريد الإلكتروني غير صحيحة 📭', 'error');
      this.highlightField(this.usernameInput);
      return;
    }

    // Check password
    if (!this.credentials.password) {
      this.showToast('يرجى إدخال كلمة المرور 🔒', 'warning');
      this.highlightField(this.passwordInput);
      return;
    }

    if (this.credentials.password.length < 6) {
      this.showToast('كلمة المرور يجب أن تكون على الأقل 6 أحرف 🔑', 'warning');
      this.highlightField(this.passwordInput);
      return;
    }

    // Submit
    this.loadingService.startLoading();
    this.authService.login(this.credentials).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.data.token);
        this.loadingService.stopLoading();
        this.showToast('تم تسجيل الدخول بنجاح 🎉', 'success');
        setTimeout(() => this.router.navigate(['/', AppRoutes.HOME, AppRoutes.STUDENT]), 1000);
      },
      (error) => {
        console.error('Login failed', error);
        this.loadingService.stopLoading();

        const msg = error?.error?.message || error?.message || '';
        if (msg.includes('not activated') || msg.includes('not active')) {
          this.showToast('لم يتم تفعيل حسابك بعد. يرجى مراجعة بريدك الإلكتروني.', 'warning');
        } else if (msg.includes('email')) {
          this.showToast('هذا البريد غير مسجل 🚫', 'error');
          this.highlightField(this.usernameInput);
        } else if (msg.includes('password')) {
          this.showToast('كلمة المرور غير صحيحة 🔑', 'error');
          this.highlightField(this.passwordInput);
        } else {
          this.showToast('حدث خطأ أثناء تسجيل الدخول ⚠️', 'error');
        }
      }
    );
  }
}
