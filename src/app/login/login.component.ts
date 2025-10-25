import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutes } from "../constants/app-routes";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  public readonly AppRoutes = AppRoutes;


  credentials = {
    email: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.credentials).subscribe(
      (response: any) => {
        console.log('Login response', response);
        localStorage.setItem('token', response.data.token);
        this.router.navigate(['/', AppRoutes.STUDENT]);
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }
}
