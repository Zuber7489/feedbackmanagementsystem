import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { Course } from '../../../../core/models/models';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css'
})
export class CourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  courseForm = this.fb.group({
    code: ['', [Validators.required]],
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    durationDays: [1, [Validators.required, Validators.min(1)]]
  });

  isEditMode = false;
  courseId: string | null = null;

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.isEditMode = true;
      this.loadCourse(this.courseId);
    }
  }

  loadCourse(id: string) {
    const courses = this.localStorageService.getItem<Course[]>('courses') || [];
    const course = courses.find(c => c.id === id);
    if (course) {
      this.courseForm.patchValue({
        code: course.code,
        title: course.title,
        description: course.description,
        durationDays: course.durationDays
      });
    }
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const courses = this.localStorageService.getItem<Course[]>('courses') || [];
      const formValue = this.courseForm.value;

      if (this.isEditMode && this.courseId) {
        const index = courses.findIndex(c => c.id === this.courseId);
        if (index !== -1) {
          courses[index] = {
            ...courses[index],
            code: formValue.code!,
            title: formValue.title!,
            description: formValue.description!,
            durationDays: formValue.durationDays!
          };
        }
      } else {
        const newCourse: Course = {
          id: crypto.randomUUID(),
          code: formValue.code!,
          title: formValue.title!,
          description: formValue.description!,
          durationDays: formValue.durationDays!,
          createdAt: new Date().toISOString()
        };
        courses.push(newCourse);
      }

      this.localStorageService.setItem('courses', courses);
      this.router.navigate(['/admin/courses']);
    }
  }
}

