import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { InputText } from "primeng/inputtext";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule, InputText],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  
  loginForm: FormGroup;
  loginError: string = ''; // Add this property to store error message
  isLoading: boolean = false; // Optional: for loading state

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: [
        '',
        [Validators.required],
      ],
      password: [
        '',
        [Validators.required],
      ],
    });
  }

  get password() {
    return this.loginForm.get('password');
  }

  get username() {
    return this.loginForm.get('username');
  }

  submit() {
    // Clear previous error
    this.loginError = '';
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.isLoading = false;
        
        // Set error message based on status code or error response
        if (err.status === 401 || err.status === 403) {
          this.loginError = 'Invalid username or password. Please try again.';
        } else if (err.status === 0) {
          this.loginError = 'Unable to connect to the server. Please check your internet connection.';
        } else {
          this.loginError = 'An error occurred during login. Please try again later.';
        }
      }
    });
  }
}