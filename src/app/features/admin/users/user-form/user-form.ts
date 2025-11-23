import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { User, Role } from '../../../../core/models/models';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './user-form.html',
    styleUrl: './user-form.css'
})
export class UserFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private localStorageService = inject(LocalStorageService);

    userForm: FormGroup;
    isEditMode = false;
    userId: string | null = null;

    constructor() {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required], // Required for new users, optional for edit? Let's keep it simple.
            role: ['PARTICIPANT', Validators.required]
        });
    }

    ngOnInit() {
        this.userId = this.route.snapshot.paramMap.get('id');
        if (this.userId) {
            this.isEditMode = true;
            this.loadUser(this.userId);
            // Password not required in edit mode if we don't want to change it
            this.userForm.get('password')?.clearValidators();
            this.userForm.get('password')?.updateValueAndValidity();
        }
    }

    loadUser(id: string) {
        const users = this.localStorageService.getItem<User[]>('users') || [];
        const user = users.find(u => u.id === id);
        if (user) {
            this.userForm.patchValue({
                name: user.name,
                email: user.email,
                role: user.role
            });
        }
    }

    onSubmit() {
        if (this.userForm.valid) {
            const users = this.localStorageService.getItem<User[]>('users') || [];
            const formValue = this.userForm.value;

            if (this.isEditMode && this.userId) {
                const index = users.findIndex(u => u.id === this.userId);
                if (index !== -1) {
                    users[index] = {
                        ...users[index],
                        name: formValue.name,
                        email: formValue.email,
                        role: formValue.role,
                        // Only update password if provided
                        passwordHash: formValue.password ? formValue.password : users[index].passwordHash
                    };
                }
            } else {
                const newUser: User = {
                    id: crypto.randomUUID(),
                    name: formValue.name,
                    email: formValue.email,
                    passwordHash: formValue.password,
                    role: formValue.role,
                    createdAt: new Date().toISOString()
                };
                users.push(newUser);
            }

            this.localStorageService.setItem('users', users);
            this.router.navigate(['/admin/users']);
        }
    }
}
