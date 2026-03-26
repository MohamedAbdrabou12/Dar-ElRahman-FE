import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutes } from '../../constants/app-routes';
import { LoadingService } from 'src/app/services/loading.service';
import { LoadingComponent } from '../shared/loading/loading.component';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, LoadingComponent, ToastComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public readonly AppRoutes = AppRoutes;

  token: string = '';
  fullName: string = '';
  tokenValid: boolean = false;
  tokenError: string = '';

  passwords = {
    password: '',
    confirmPassword: '',
  };

  showPassword = false;
  showConfirmPassword = false;
  resetSuccess = false;

  toast: { message: string; type: 'success' | 'error' | 'warning' | 'info' } | null = null;

  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    protected loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.tokenError = 'رابط إعادة التعيين غير صالح. يرجى التحقق من بريدك الإلكتروني.';
      return;
    }
    this.validateToken();
  }

  private validateToken(): void {
    this.loadingService.startLoading();
    this.authService.validateResetToken(this.token).subscribe(
      (response: any) => {
        this.fullName = response.data || '';
        this.tokenValid = true;
        this.loadingService.stopLoading();
      },
      (error) => {
        this.loadingService.stopLoading();
        const msg = error?.error?.message || error?.message || '';
        if (msg.includes('expired')) {
          this.tokenError = 'انتهت صلاحية رابط إعادة التعيين. يرجى طلب رابط جديد.';
        } else {
          this.tokenError = 'رابط إعادة التعيين غير صالح. يرجى التحقق من بريدك الإلكتروني.';
        }
      }
    );
  }

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
    if (!this.passwords.password) {
      this.showToast('يرجى إدخال كلمة المرور', 'warning');
      this.highlightField(this.passwordInput);
      return;
    }

    if (this.passwords.password.length < 6) {
      this.showToast('كلمة المرور يجب أن تكون على الأقل 6 أحرف', 'warning');
      this.highlightField(this.passwordInput);
      return;
    }

    if (this.passwords.password !== this.passwords.confirmPassword) {
      this.showToast('كلمتا المرور غير متطابقتين', 'error');
      this.highlightField(this.confirmPasswordInput);
      return;
    }

    this.loadingService.startLoading();
    this.authService.resetPassword(this.token, this.passwords.password).subscribe(
      () => {
        this.loadingService.stopLoading();
        this.resetSuccess = true;
        this.showToast('تم إعادة تعيين كلمة المرور بنجاح!', 'success');
        setTimeout(() => this.router.navigate(['/', AppRoutes.LOGIN]), 2500);
      },
      (error) => {
        this.loadingService.stopLoading();
        this.showToast('حدث خطأ أثناء إعادة تعيين كلمة المرور. حاول مرة أخرى.', 'error');
      }
    );
  }
}
