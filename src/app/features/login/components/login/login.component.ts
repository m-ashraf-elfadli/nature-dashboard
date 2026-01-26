import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(6)],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6)],
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
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log(this.loginForm.value);
  }

}
