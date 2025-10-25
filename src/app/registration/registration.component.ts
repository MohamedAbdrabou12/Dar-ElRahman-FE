import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AppRoutes} from "../constants/app-routes";
import {AlertService} from "../services/alert.service";

@Component({
  selector: 'app-registration',
  standalone: true, // Assuming you are using Angular 16+ standalone components
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {

  public readonly AppRoutes = AppRoutes;
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private alertService: AlertService, private router: Router) {
  }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit() {
    console.log('User Data', this.userForm?.value);
    if (this.userForm.valid) {
      this.authService.register(this.userForm?.value).subscribe(
        (response: any) => {
          this.alertService.success("تم التسجيل بنجاح")
          console.log('Register response', response);
          // NOTE: It is recommended to use the Authentication module for token storage if possible,
          // but keeping localStorage for consistency with the original code.
          localStorage.setItem('token', response.data.token);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.alertService.error(error.errorDescription);
          console.error('Registration failed', error);
        }
      );
    }
  }

  buildForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // Added Validators.email for better form validation
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roles: [[''], Validators.required] // Roles should be an array, initialized as empty array or set with a default
    })
    ;
  }
}


















// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Router, RouterLink } from '@angular/router';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AppRoutes } from '../constants/app-routes';
// import { AlertService } from '../services/alert.service';

// @Component({
//   selector: 'app-registration',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.scss'],
// })
// export class RegistrationComponent implements OnInit {
//   public readonly AppRoutes = AppRoutes;
//   userForm!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private alertService: AlertService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.buildForm();
//   }

//   buildForm() {
//     this.userForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       roles: ['', Validators.required],
//     });
//   }

//   onSubmit() {
//     if (this.userForm.valid) {
//       this.authService.register(this.userForm.value).subscribe(
//         (response: any) => {
//           this.alertService.success('تم التسجيل بنجاح');
//           localStorage.setItem('token', response.data.token);
//           this.router.navigate([`/${AppRoutes.LOGIN}`]);
//         },
//         (error) => {
//           this.alertService.error(error.errorDescription || 'حدث خطأ أثناء التسجيل');
//         }
//       );
//     }
//   }
// }
















// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Router, RouterLink } from '@angular/router';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AppRoutes } from "../constants/app-routes";
// import { AlertService } from "../services/alert.service";

// @Component({
//   selector: 'app-registration',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.scss'],
// })
// export class RegistrationComponent implements OnInit {
//   public readonly AppRoutes = AppRoutes;
//   userForm!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private alertService: AlertService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.buildForm();
//   }

//   buildForm() {
//     this.userForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       roles: ['', Validators.required],
//     });
//   }

//   onSubmit() {
//     if (this.userForm.valid) {
//       this.authService.register(this.userForm.value).subscribe(
//         (response: any) => {
//           this.alertService.success('تم التسجيل بنجاح');
//           localStorage.setItem('token', response.data.token);
//           this.router.navigate(['/login']);
//         },
//         (error) => {
//           this.alertService.error(error.errorDescription || 'حدث خطأ أثناء التسجيل');
//         }
//       );
//     }
//   }
// }






















// import {Component, OnInit} from '@angular/core';
// import {AuthService} from '../services/auth.service';
// import {Router, RouterLink} from '@angular/router';
// import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
// import {CommonModule} from '@angular/common';
// import {AppRoutes} from "../constants/app-routes";
// import {AlertService} from "../services/alert.service";

// @Component({
//   selector: 'app-registration',
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './registration.component.html',
//   styleUrl: './registration.component.scss',
// })
// export class RegistrationComponent implements OnInit {

//   public readonly AppRoutes = AppRoutes;
//   userForm!: FormGroup;

//   constructor(private fb: FormBuilder, private authService: AuthService, private alertService: AlertService, private router: Router) {
//   }

//   ngOnInit() {
//     this.buildForm();
//   }

//   onSubmit() {
//     console.log('User Data', this.userForm?.value);
//     if (this.userForm.valid) {
//       this.authService.register(this.userForm?.value).subscribe(
//         (response: any) => {
//           this.alertService.success("تم التسجيل بنجاح")
//           console.log('Register response', response);
//           localStorage.setItem('token', response.data.token);
//           this.router.navigate(['/login']);
//         },
//         (error) => {
//           this.alertService.error(error.errorDescription);
//           console.error('Registration failed', error);
//         }
//       );
//     }
//   }

//   buildForm() {
//     this.userForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       email: ['', Validators.required],
//       password: ['', Validators.required],
//       roles: ['', Validators.required]
//     })
//     ;
//   }
// }
