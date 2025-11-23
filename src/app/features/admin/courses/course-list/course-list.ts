import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { Course } from '../../../../core/models/models';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseListComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);
  courses: Course[] = [];

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courses = this.localStorageService.getItem<Course[]>('courses') || [];
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courses = this.courses.filter(c => c.id !== id);
      this.localStorageService.setItem('courses', this.courses);
    }
  }
}

