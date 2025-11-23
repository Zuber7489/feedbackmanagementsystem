import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { Program, Course } from '../../../../core/models/models';

@Component({
  selector: 'app-program-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './program-list.html',
  styleUrl: './program-list.css'
})
export class ProgramListComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);
  programs: Program[] = [];
  courses: Course[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.programs = this.localStorageService.getItem<Program[]>('programs') || [];
    this.courses = this.localStorageService.getItem<Course[]>('courses') || [];
  }

  getCourseTitle(courseId: string): string {
    return this.courses.find(c => c.id === courseId)?.title || 'Unknown Course';
  }

  deleteProgram(id: string) {
    if (confirm('Are you sure you want to delete this program?')) {
      // Soft delete as per requirements "Programs soft-deleted using status: CANCELLED"
      const program = this.programs.find(p => p.id === id);
      if (program) {
        program.status = 'CANCELLED';
        this.localStorageService.setItem('programs', this.programs);
      }
    }
  }
}
