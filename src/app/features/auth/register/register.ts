import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, Role } from '../../../core/models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['PARTICIPANT' as Role, [Validators.required]]
  });

  errorMsg = '';
  successMsg = '';

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password, role } = this.registerForm.value;

      if (name && email && password && role) {
        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
          passwordHash: password, // In real app, hash this
          role: role as Role,
          createdAt: new Date().toISOString()
        };

        if (this.authService.register(newUser)) {
          this.successMsg = 'User registered successfully!';
          this.registerForm.reset({ role: 'PARTICIPANT' });
          setTimeout(() => this.successMsg = '', 3000);
        } else {
          this.errorMsg = 'User with this email already exists.';
        }
      }
    }
  }
}

