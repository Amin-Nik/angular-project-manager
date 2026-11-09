import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

const user = {
  userName: 'a',
  password: 'a',
};

@Component({
  selector: 'app-login',
  standalone: false,
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  fb = inject(FormBuilder);
  router = inject(Router);
  loginError = signal(false);

  logInForm = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    const userName = this.logInForm.controls.userName.value;
    const password = this.logInForm.controls.password.value;
    if (userName === user.userName && password === user.password) {
      localStorage.setItem('project-manager-token', 'token');
      this.router.navigate(['panel/dashboard']);
    } else {
      this.loginError.set(true);
    }
  }
}
