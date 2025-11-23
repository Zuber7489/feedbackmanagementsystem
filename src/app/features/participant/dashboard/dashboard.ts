import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AuthService } from '../../../core/services/auth.service';
import { Program, Course, Feedback } from '../../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);
  private authService = inject(AuthService);

  enrolledPrograms: Program[] = [];
  courses: Course[] = [];
  feedbacks: Feedback[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      const allPrograms = this.localStorageService.getItem<Program[]>('programs') || [];
      this.enrolledPrograms = allPrograms.filter(p => p.enrolledUserIds?.includes(currentUser.id));

      this.courses = this.localStorageService.getItem<Course[]>('courses') || [];
      this.feedbacks = this.localStorageService.getItem<Feedback[]>('feedbacks') || [];
    }
  }

  getCourseTitle(courseId: string): string {
    return this.courses.find(c => c.id === courseId)?.title || 'Unknown Course';
  }

  hasSubmittedFeedback(programId: string): boolean {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return false;
    return this.feedbacks.some(f => f.programId === programId && f.participantId === currentUser.id);
  }
}
