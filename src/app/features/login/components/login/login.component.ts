import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { InputText } from "primeng/inputtext";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule, InputText, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  loginForm: FormGroup;
  loginError: string = '';
  isLoading: boolean = false;

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
        this.isLoading = false;

        if (err.status === 401 || err.status === 403) {
          this.loginError = 'login.errors.invalid_credentials';
        } else if (err.status === 0) {
          this.loginError = 'login.errors.server_unreachable';
        } else {
          this.loginError = 'login.errors.generic';
        }
      }
    });
  }
}