import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AuthService } from '../../../core/services/auth.service';
import { Program, Course, Feedback } from '../../../core/models/models';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './feedback-form.html',
  styleUrl: './feedback-form.css'
})
export class FeedbackFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private localStorageService = inject(LocalStorageService);
  private authService = inject(AuthService);

  feedbackForm: FormGroup;
  programId: string | null = null;
  program: Program | undefined;
  course: Course | undefined;

  constructor() {
    this.feedbackForm = this.fb.group({
      q1: [5, Validators.required], // Content Quality
      q2: [5, Validators.required], // Instructor Knowledge
      q3: [5, Validators.required], // Practical Applicability
      comments: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.programId = this.route.snapshot.paramMap.get('programId');
    if (this.programId) {
      this.loadProgram(this.programId);
    }
  }

  loadProgram(id: string) {
    const programs = this.localStorageService.getItem<Program[]>('programs') || [];
    this.program = programs.find(p => p.id === id);
    if (this.program) {
      const courses = this.localStorageService.getItem<Course[]>('courses') || [];
      this.course = courses.find(c => c.id === this.program?.courseId);
    }
  }

  onSubmit() {
    if (this.feedbackForm.valid && this.programId) {
      const currentUser = this.authService.currentUser();
      if (!currentUser) return;

      const feedbacks = this.localStorageService.getItem<Feedback[]>('feedbacks') || [];

      // Calculate overall rating (average)
      const { q1, q2, q3, comments } = this.feedbackForm.value;
      const overall = (q1 + q2 + q3) / 3;

      const newFeedback: Feedback = {
        id: crypto.randomUUID(),
        programId: this.programId,
        participantId: currentUser.id,
        ratings: { q1, q2, q3, overall },
        comments: comments,
        submittedAt: new Date().toISOString()
      };

      feedbacks.push(newFeedback);
      this.localStorageService.setItem('feedbacks', feedbacks);
      this.router.navigate(['/participant']);
    }
  }
}

