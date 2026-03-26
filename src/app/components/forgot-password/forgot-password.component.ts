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
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, LoadingComponent, ToastComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  public readonly AppRoutes = AppRoutes;

  email: string = '';
  emailSent: boolean = false;
  errorMessage: string = '';

  toast: { message: string; type: 'success' | 'error' | 'warning' | 'info' } | null = null;

  @ViewChild('emailInput') emailInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    protected loadingService: LoadingService
  ) {}

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3000);
  }

  private highlightField(ref: ElementRef | undefined) {
    if (!ref) return;
    const el = ref.nativeElement as HTMLElement;
    el.classList.add('border-red-500', 'animate-shake');
    el.focus();
    setTimeout(() => el.classList.remove('border-red-500', 'animate-shake'), 1500);
  }

  onSubmit(form: NgForm) {
    this.errorMessage = '';

    if (!this.email || !this.email.trim()) {
      this.showToast('يرجى إدخال البريد الإلكتروني', 'warning');
      this.highlightField(this.emailInput);
      return;
    }

    this.loadingService.startLoading();
    this.authService.forgotPassword(this.email.trim()).subscribe(
      () => {
        this.loadingService.stopLoading();
        this.emailSent = true;
        this.showToast('تم إرسال رابط إعادة تعيين كلمة المرور بنجاح!', 'success');
      },
      (error) => {
        this.loadingService.stopLoading();
        const msg = error?.error?.message || error?.message || '';
        if (msg.includes('not found') || msg.includes('No account')) {
          this.errorMessage = 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني.';
        } else {
          this.errorMessage = 'حدث خطأ أثناء إرسال رابط إعادة التعيين. حاول مرة أخرى.';
        }
        this.showToast(this.errorMessage, 'error');
      }
    );
  }
}
