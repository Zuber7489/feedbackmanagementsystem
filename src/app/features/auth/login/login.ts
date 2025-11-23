import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  errorMsg = '';

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (email && password) {
        if (this.authService.login(email, password)) {
          const role = this.authService.currentUser()?.role;
          if (role === 'ADMIN') this.router.navigate(['/admin']);
          else if (role === 'COORDINATOR') this.router.navigate(['/coordinator']);
          else if (role === 'PARTICIPANT') this.router.navigate(['/participant']);
          else this.router.navigate(['/']);
        } else {
          this.errorMsg = 'Invalid email or password';
        }
      }
    }
  }
}

