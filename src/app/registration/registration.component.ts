import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AppRoutes} from "../constants/app-routes";
import {AlertService} from "../services/alert.service";

@Component({
  selector: 'app-registration',
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
      email: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required]
    })
    ;
  }
}
