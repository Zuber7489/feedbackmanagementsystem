import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { Faculty } from '../../../../core/models/models';

@Component({
  selector: 'app-faculty-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './faculty-form.html',
  styleUrl: './faculty-form.css'
})
export class FacultyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  facultyForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    skills: this.fb.array([this.fb.control('', Validators.required)])
  });

  isEditMode = false;
  facultyId: string | null = null;

  get skills() {
    return this.facultyForm.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  ngOnInit() {
    this.facultyId = this.route.snapshot.paramMap.get('id');
    if (this.facultyId) {
      this.isEditMode = true;
      this.loadFaculty(this.facultyId);
    }
  }

  loadFaculty(id: string) {
    const faculties = this.localStorageService.getItem<Faculty[]>('faculties') || [];
    const faculty = faculties.find(f => f.id === id);
    if (faculty) {
      this.facultyForm.patchValue({
        name: faculty.name,
        email: faculty.email
      });

      this.skills.clear();
      faculty.skills.forEach(skill => {
        this.skills.push(this.fb.control(skill, Validators.required));
      });
    }
  }

  onSubmit() {
    if (this.facultyForm.valid) {
      const faculties = this.localStorageService.getItem<Faculty[]>('faculties') || [];
      const formValue = this.facultyForm.value;

      if (this.isEditMode && this.facultyId) {
        const index = faculties.findIndex(f => f.id === this.facultyId);
        if (index !== -1) {
          faculties[index] = {
            ...faculties[index],
            name: formValue.name!,
            email: formValue.email!,
            skills: formValue.skills as string[]
          };
        }
      } else {
        const newFaculty: Faculty = {
          id: crypto.randomUUID(),
          name: formValue.name!,
          email: formValue.email!,
          skills: formValue.skills as string[]
        };
        faculties.push(newFaculty);
      }

      this.localStorageService.setItem('faculties', faculties);
      this.router.navigate(['/admin/faculties']);
    }
  }
}
