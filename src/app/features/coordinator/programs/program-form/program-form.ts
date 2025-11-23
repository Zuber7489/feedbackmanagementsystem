import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { Program, Course, Faculty, Role } from '../../../../core/models/models';

@Component({
  selector: 'app-program-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './program-form.html',
  styleUrl: './program-form.css'
})
export class ProgramFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private localStorageService = inject(LocalStorageService);

  programForm: FormGroup;
  isEditMode = false;
  programId: string | null = null;
  courses: Course[] = [];
  faculties: Faculty[] = [];

  constructor() {
    this.programForm = this.fb.group({
      courseId: ['', Validators.required],
      facultyId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['SCHEDULED', Validators.required]
    });
  }

  ngOnInit() {
    this.loadOptions();
    this.programId = this.route.snapshot.paramMap.get('id');
    if (this.programId) {
      this.isEditMode = true;
      this.loadProgram(this.programId);
    }
  }

  loadOptions() {
    this.courses = this.localStorageService.getItem<Course[]>('courses') || [];
    this.faculties = this.localStorageService.getItem<Faculty[]>('faculties') || [];
  }

  loadProgram(id: string) {
    const programs = this.localStorageService.getItem<Program[]>('programs') || [];
    const program = programs.find(p => p.id === id);
    if (program) {
      this.programForm.patchValue(program);
    }
  }

  onSubmit() {
    if (this.programForm.valid) {
      const programs = this.localStorageService.getItem<Program[]>('programs') || [];
      const formValue = this.programForm.value;

      if (this.isEditMode && this.programId) {
        const index = programs.findIndex(p => p.id === this.programId);
        if (index !== -1) {
          programs[index] = { ...programs[index], ...formValue };
        }
      } else {
        const newProgram: Program = {
          id: crypto.randomUUID(),
          ...formValue
        };
        programs.push(newProgram);
      }

      this.localStorageService.setItem('programs', programs);
      this.router.navigate(['/coordinator/programs']);
    }
  }
}
