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
    firstName: '',
    lastName: '',
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
  @ViewChild('firstNameInput') firstNameInput!: ElementRef;
  @ViewChild('lastNameInput') lastNameInput!: ElementRef;
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
    if (!this.user.firstName.trim()) {
      this.showToast('يرجى إدخال الاسم الأول 🧾', 'warning');
      this.highlightField(this.firstNameInput);
      return false;
    }

    if (!this.user.lastName.trim()) {
      this.showToast('يرجى إدخال الاسم الأخير 🧾', 'warning');
      this.highlightField(this.lastNameInput);
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














// import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { Router, RouterLink } from '@angular/router';
// import { FormsModule, NgForm } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AppRoutes } from '../../constants/app-routes';
// import { LoadingComponent } from '../shared/loading/loading.component';
// import { LoadingService } from 'src/app/services/loading.service';
// import { ToastComponent } from '../shared/toast/toast.component';

// @Component({
//   selector: 'app-registration',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterLink, LoadingComponent, ToastComponent],
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.scss'],
// })
// export class RegistrationComponent {
//   public readonly AppRoutes = AppRoutes;

//   /** User data model */
//   user = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     roles: [] as string[],
//   };

//   showRoles = false;

//   /** Toast handler */
//   toast: { message: string; type: 'success' | 'error' | 'warning' | 'info' } | null = null;

//   /** References to form fields for focus control */
//   @ViewChild('firstNameInput') firstNameInput!: ElementRef;
//   @ViewChild('lastNameInput') lastNameInput!: ElementRef;
//   @ViewChild('emailInput') emailInput!: ElementRef;
//   @ViewChild('passwordInput') passwordInput!: ElementRef;
//   @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;

//   @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     protected loadingService: LoadingService
//   ) {}

//   /** Detect clicks outside dropdown to close it */
//   @HostListener('document:click', ['$event'])
//   clickOutside(event: MouseEvent) {
//     if (
//       this.showRoles &&
//       this.dropdownContainer &&
//       !this.dropdownContainer.nativeElement.contains(event.target)
//     ) {
//       this.showRoles = false;
//     }
//   }

//   /** Toast utility function */
//   showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
//     this.toast = { message, type };
//     setTimeout(() => (this.toast = null), 3000);
//   }

//   /** Focus and highlight invalid field */
//   private highlightField(ref: ElementRef | undefined) {
//     if (!ref) return;
//     const el = ref.nativeElement as HTMLElement;
//     el.classList.add('border-red-500', 'animate-shake');
//     el.focus();

//     // Remove red border after few seconds
//     setTimeout(() => {
//       el.classList.remove('border-red-500', 'animate-shake');
//     }, 1500);
//   }

//   /** Toggle user roles */
//   toggleRole(role: string) {
//     const index = this.user.roles.indexOf(role);
//     if (index > -1) {
//       this.user.roles.splice(index, 1);
//     } else {
//       this.user.roles.push(role);
//     }
//   }

//   /** Validate form fields before submitting */
//   private validateForm(form: NgForm): boolean {
//     if (!this.user.firstName.trim()) {
//       this.showToast('يرجى إدخال الاسم الأول 🧾', 'warning');
//       this.highlightField(this.firstNameInput);
//       return false;
//     }

//     if (!this.user.lastName.trim()) {
//       this.showToast('يرجى إدخال الاسم الأخير 🧾', 'warning');
//       this.highlightField(this.lastNameInput);
//       return false;
//     }

//     if (!this.user.email.trim()) {
//       this.showToast('يرجى إدخال البريد الإلكتروني 📧', 'warning');
//       this.highlightField(this.emailInput);
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(this.user.email)) {
//       this.showToast('صيغة البريد الإلكتروني غير صحيحة 📭', 'error');
//       this.highlightField(this.emailInput);
//       return false;
//     }

//     if (!this.user.password) {
//       this.showToast('يرجى إدخال كلمة المرور 🔒', 'warning');
//       this.highlightField(this.passwordInput);
//       return false;
//     }

//     if (this.user.password.length < 6) {
//       this.showToast('كلمة المرور يجب أن تكون على الأقل 6 أحرف 🔑', 'warning');
//       this.highlightField(this.passwordInput);
//       return false;
//     }

//     if (this.user.password !== this.user.confirmPassword) {
//       this.showToast('كلمتا المرور غير متطابقتين ❌', 'error');
//       this.highlightField(this.confirmPasswordInput);
//       return false;
//     }

//     if (this.user.roles.length === 0) {
//       this.showToast('يجب اختيار دور واحد على الأقل 👤', 'warning');
//       this.showRoles = true;
//       return false;
//     }

//     return true;
//   }

//   /** Form submission with validation */
//   onSubmit(form: NgForm) {
//     if (!this.validateForm(form)) return;

//     this.loadingService.startLoading();

//     this.authService.register(this.user).subscribe(
//       (response: any) => {
//         console.log('Register response', response);
//         localStorage.setItem('token', response.data.token);
//         this.loadingService.stopLoading();

//         this.showToast('تم إنشاء الحساب بنجاح 🎉', 'success');
//         setTimeout(() => this.router.navigate(['/']), 1500);
//       },
//       (error) => {
//         console.error('Registration failed', error);
//         this.loadingService.stopLoading();

//         if (error?.error?.message?.includes('email')) {
//           this.showToast('هذا البريد مسجل بالفعل 🚫', 'error');
//           this.highlightField(this.emailInput);
//         } else {
//           this.showToast('حدث خطأ أثناء التسجيل، حاول مرة أخرى ⚠️', 'error');
//         }
//       }
//     );
//   }
// }




























// import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { Router, RouterLink } from '@angular/router';
// import { FormsModule, NgForm } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AppRoutes } from '../../constants/app-routes';
// import { LoadingComponent } from '../shared/loading/loading.component';
// import { LoadingService } from 'src/app/services/loading.service';
// import { ToastComponent } from '../shared/toast/toast.component';

// @Component({
//   selector: 'app-registration',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterLink, LoadingComponent, ToastComponent],
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.scss'],
// })
// export class RegistrationComponent {
//   public readonly AppRoutes = AppRoutes;

//   /** User data model */
//   user = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     roles: [] as string[],
//   };

//   showRoles = false;

//   /** Toast handler */
//   toast: { message: string; type: 'success' | 'error' | 'warning' | 'info' } | null = null;

//   /** Reference to the dropdown container */
//   @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     protected loadingService: LoadingService
//   ) {}

//   /** Detect clicks outside dropdown to close it */
//   @HostListener('document:click', ['$event'])
//   clickOutside(event: MouseEvent) {
//     if (
//       this.showRoles &&
//       this.dropdownContainer &&
//       !this.dropdownContainer.nativeElement.contains(event.target)
//     ) {
//       this.showRoles = false;
//     }
//   }

//   /** Toast utility function */
//   showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
//     this.toast = { message, type };
//     setTimeout(() => (this.toast = null), 3000);
//   }

//   /** Toggle user roles */
//   toggleRole(role: string) {
//     const index = this.user.roles.indexOf(role);
//     if (index > -1) {
//       this.user.roles.splice(index, 1);
//     } else {
//       this.user.roles.push(role);
//     }
//   }

//   /** Validate form fields before submitting */
//   private validateForm(form: NgForm): boolean {
//     if (form.invalid) {
//       this.showToast('يرجى إدخال جميع الحقول المطلوبة ⚠️', 'warning');
//       form.form.markAllAsTouched();
//       return false;
//     }

//     if (!this.user.firstName.trim() || !this.user.lastName.trim()) {
//       this.showToast('يرجى إدخال الاسم الكامل 🧾', 'warning');
//       return false;
//     }

//     if (!this.user.email.includes('@') || !this.user.email.includes('.')) {
//       this.showToast('البريد الإلكتروني غير صالح 📧', 'error');
//       return false;
//     }

//     if (this.user.password.length < 6) {
//       this.showToast('كلمة المرور يجب أن تكون على الأقل 6 أحرف 🔒', 'warning');
//       return false;
//     }

//     if (this.user.password !== this.user.confirmPassword) {
//       this.showToast('كلمتا المرور غير متطابقتين ❌', 'error');
//       return false;
//     }

//     if (this.user.roles.length === 0) {
//       this.showToast('يجب اختيار دور واحد على الأقل 👤', 'warning');
//       return false;
//     }

//     return true;
//   }

//   /** Form submission with validation */
//   onSubmit(form: NgForm) {
//     //  validate before sending
//     if (!this.validateForm(form)) return;

//     this.loadingService.startLoading();

//     // Step 2: call API
//     this.authService.register(this.user).subscribe(
//       (response: any) => {
//         console.log('Register response', response);
//         localStorage.setItem('token', response.data.token);
//         this.loadingService.stopLoading();

//         // Step 3: show success toast
//         this.showToast('تم إنشاء الحساب بنجاح 🎉', 'success');

//         // Step 4: redirect after a short delay
//         setTimeout(() => this.router.navigate(['/']), 1500);
//       },
//       (error) => {
//         console.error('Registration failed', error);
//         this.loadingService.stopLoading();

//         // Handle specific backend errors (optional)
//         if (error?.error?.message?.includes('email')) {
//           this.showToast('هذا البريد مسجل بالفعل 🚫', 'error');
//         } else {
//           this.showToast('حدث خطأ أثناء التسجيل، حاول مرة أخرى ⚠️', 'error');
//         }
//       }
//     );
//   }
// }

























// import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { Router, RouterLink } from '@angular/router';
// import { FormsModule, NgForm } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AppRoutes } from '../../constants/app-routes';
// import { LoadingComponent } from '../shared/loading/loading.component';
// import { LoadingService } from 'src/app/services/loading.service';
// import { ToastComponent } from '../shared/toast/toast.component';

// @Component({
//   selector: 'app-registration',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterLink, LoadingComponent, ToastComponent],
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.scss'],
// })
// export class RegistrationComponent {
//   public readonly AppRoutes = AppRoutes;

//   user = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     roles: [] as string[],
//   };

//   showRoles = false;

//   /** Reference to the dropdown container */
//   @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     protected loadingService: LoadingService
//   ) {}

//   /** Detect clicks outside dropdown to close it */
//   @HostListener('document:click', ['$event'])
//   clickOutside(event: MouseEvent) {
//     if (
//       this.showRoles &&
//       this.dropdownContainer &&
//       !this.dropdownContainer.nativeElement.contains(event.target)
//     ) {
//       this.showRoles = false;
//     }
//   }

//   /** Toggle user roles */
//   toggleRole(role: string) {
//     const index = this.user.roles.indexOf(role);
//     if (index > -1) {
//       this.user.roles.splice(index, 1);
//     } else {
//       this.user.roles.push(role);
//     }
//   }
//   // tost messages
//   toast: { message: string; type: 'success' | 'error' | 'warning' | 'info' } | null = null;
//   showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
//     this.toast = { message, type };
//     setTimeout(() => (this.toast = null), 3000);
//   }

//   /**Form submission with validation */
//   onSubmit(form: NgForm) {
//     if (form.invalid) {
//       form.form.markAllAsTouched();
//       return;
//     }

//     this.loadingService.startLoading();

//     this.authService.register(this.user).subscribe(
//       (response: any) => {
//         console.log('Register response', response);
//         localStorage.setItem('token', response.data.token);
//         this.loadingService.stopLoading();
//         this.router.navigate(['/']);
//       },
//       (error) => {
//         console.error('Registration failed', error);
//         this.loadingService.stopLoading();
//       }
//     );
//   }
// }
























// import { Component, ElementRef, HostListener  } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { Router, RouterLink } from '@angular/router';
// import { FormsModule, NgForm } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AppRoutes } from '../../constants/app-routes';
// import { LoadingComponent } from '../shared/loading/loading.component';
// import { LoadingService } from 'src/app/services/loading.service';

// @Component({
//   selector: 'app-registration',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterLink, LoadingComponent],
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.scss'],
// })
// export class RegistrationComponent {
//   public readonly AppRoutes = AppRoutes;

//   user = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     roles: [] as string[],
//   };

//   showRoles = false;

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     protected loadingService: LoadingService,
//     public eRef: ElementRef
//   ) {}

//   @HostListener('document:click', ['$event'])
//   clickOutside(event: MouseEvent) {
//     if (!this.eRef.nativeElement.contains(event.target)) {
//       this.showRoles = false;
//     }
//   }
//   /** Toggle user roles */
//   toggleRole(role: string) {
//     const index = this.user.roles.indexOf(role);
//     if (index > -1) {
//       this.user.roles.splice(index, 1);
//     } else {
//       this.user.roles.push(role);
//     }
//   }

//   /**Form submission with validation */
//   onSubmit(form: NgForm) {
//     if (form.invalid) {
//       form.form.markAllAsTouched();
//       return;
//     }

//     // if (this.user.password !== this.user.confirmPassword) {
//     //   alert('كلمتا المرور غير متطابقتين');
//     //   return;
//     // }

//     this.loadingService.startLoading();

//     this.authService.register(this.user).subscribe(
//       (response: any) => {
//         console.log('Register response', response);
//         localStorage.setItem('token', response.data.token);
//         this.loadingService.stopLoading();
//         this.router.navigate(['/']);
//       },
//       (error) => {
//         console.error('Registration failed', error);
//         this.loadingService.stopLoading();
//       }
//     );
//   }
// }





















// import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { Router, RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AppRoutes } from '../../constants/app-routes';
// import { LoadingComponent } from '../shared/loading/loading.component';
// import { LoadingService } from 'src/app/services/loading.service';

// @Component({
//   selector: 'app-registration',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterLink, LoadingComponent],
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.scss'], // ✅ fixed plural
// })
// export class RegistrationComponent {
//   public readonly AppRoutes = AppRoutes;

//   user = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '', // ✅ added confirm password field
//     roles: [] as string[],
//   };

//   showRoles = false; // ✅ controls dropdown visibility

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     protected loadingService: LoadingService
//   ) {}

//   toggleRole(role: string) {
//     this.user.roles = this.user.roles || [];
//     const index = this.user.roles.indexOf(role);
//     if (index > -1) {
//       this.user.roles.splice(index, 1);
//     } else {
//       this.user.roles.push(role);
//     }
//   }

//   onSubmit() {
//     if (this.user.password !== this.user.confirmPassword) {
//       alert('كلمتا المرور غير متطابقتين');
//       return;
//     }


//     console.log('User Data', this.user);
//     this.loadingService.startLoading();

//     this.authService.register(this.user).subscribe(
//       (response: any) => {
//         console.log('Register response', response);
//         localStorage.setItem('token', response.data.token);
//         this.loadingService.stopLoading();
//         this.router.navigate(['/']);
//       },
//       (error) => {
//         console.error('Registration failed', error);
//         this.loadingService.stopLoading();
//       }
//     );
//   }
// }



























// import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { Router, RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms'; // Import FormsModule
// import { CommonModule } from '@angular/common';
// import { AppRoutes } from '../../constants/app-routes';
// import { LoadingComponent } from '../shared/loading/loading.component';
// import { LoadingService } from 'src/app/services/loading.service';

// @Component({
//   selector: 'app-registration',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterLink, LoadingComponent], // Add FormsModule here
//   templateUrl: './registration.component.html',
//   styleUrl: './registration.component.scss',
// })
// export class RegistrationComponent {
//   public readonly AppRoutes = AppRoutes;

//   user = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     roles: [],
//   };

//   constructor(private authService: AuthService, private router: Router, protected loadingService: LoadingService) {}

//   onSubmit() {
//     console.log('User Data', this.user);
//     this.loadingService.startLoading();
//     this.authService.register(this.user).subscribe(
//       (response: any) => {
//         console.log('Register response', response);
//         localStorage.setItem('token', response.data.token);
//         this.loadingService.stopLoading();
//         this.router.navigate(['/']);
//       },
//       (error) => {
//         console.error('Registration failed', error);
//         this.loadingService.stopLoading();
//       }
//     );
//   }
// }
