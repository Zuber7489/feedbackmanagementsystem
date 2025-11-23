import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Program, User, Course, AttendanceStatus } from '../../../core/models/models';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enrollment.html',
  styleUrl: './enrollment.css'
})
export class EnrollmentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private localStorageService = inject(LocalStorageService);

  programs: Program[] = [];
  courses: Course[] = [];
  users: User[] = [];
  participants: User[] = [];

  selectedProgramId: string = '';
  selectedProgram: Program | undefined;
  enrolledUserIds: string[] = [];

  enrollmentForm: FormGroup;

  constructor() {
    this.enrollmentForm = this.fb.group({
      userId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.programs = this.localStorageService.getItem<Program[]>('programs') || [];
    this.courses = this.localStorageService.getItem<Course[]>('courses') || [];
    this.users = this.localStorageService.getItem<User[]>('users') || [];

    // Filter only participants
    this.participants = this.users.filter(u => u.role === 'PARTICIPANT');
  }

  getCourseTitle(courseId: string): string {
    return this.courses.find(c => c.id === courseId)?.title || 'Unknown Course';
  }

  onProgramSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedProgramId = select.value;
    this.selectedProgram = this.programs.find(p => p.id === this.selectedProgramId);

    if (this.selectedProgram) {
      this.enrolledUserIds = this.selectedProgram.enrolledUserIds || [];
    } else {
      this.enrolledUserIds = [];
    }
  }

  getEnrolledUsers(): User[] {
    return this.users.filter(u => this.enrolledUserIds.includes(u.id));
  }

  getAvailableParticipants(): User[] {
    return this.participants.filter(u => !this.enrolledUserIds.includes(u.id));
  }

  enrollUser() {
    if (this.enrollmentForm.valid && this.selectedProgram) {
      const userId = this.enrollmentForm.value.userId;

      if (!this.selectedProgram.enrolledUserIds) {
        this.selectedProgram.enrolledUserIds = [];
      }

      this.selectedProgram.enrolledUserIds.push(userId);

      // Initialize attendance for this user
      if (!this.selectedProgram.attendance) {
        this.selectedProgram.attendance = [];
      }

      // Add default attendance record (PRESENT)
      this.selectedProgram.attendance.push({
        userId: userId,
        status: AttendanceStatus.PRESENT, // Default
        date: new Date().toISOString()
      });

      this.savePrograms();
      this.enrollmentForm.reset();
      this.enrolledUserIds = this.selectedProgram.enrolledUserIds; // Update local state
    }
  }

  removeUser(userId: string) {
    if (this.selectedProgram && confirm('Are you sure you want to remove this participant?')) {
      this.selectedProgram.enrolledUserIds = this.selectedProgram.enrolledUserIds?.filter(id => id !== userId);
      // Also remove attendance records for this user? Maybe keep for history? 
      // Requirement says "Manage enrollments", implies removal.
      // Let's remove attendance for now to keep it clean.
      if (this.selectedProgram.attendance) {
        this.selectedProgram.attendance = this.selectedProgram.attendance.filter(a => a.userId !== userId);
      }

      this.savePrograms();
      this.enrolledUserIds = this.selectedProgram.enrolledUserIds || [];
    }
  }

  updateAttendance(userId: string, event: Event) {
    const select = event.target as HTMLSelectElement;
    const status = select.value as AttendanceStatus;

    if (this.selectedProgram) {
      if (!this.selectedProgram.attendance) {
        this.selectedProgram.attendance = [];
      }

      const existingRecord = this.selectedProgram.attendance.find(a => a.userId === userId);
      if (existingRecord) {
        existingRecord.status = status;
        existingRecord.date = new Date().toISOString(); // Update timestamp
      } else {
        this.selectedProgram.attendance.push({
          userId: userId,
          status: status,
          date: new Date().toISOString()
        });
      }
      this.savePrograms();
    }
  }

  getAttendanceStatus(userId: string): string {
    if (this.selectedProgram?.attendance) {
      const record = this.selectedProgram.attendance.find(a => a.userId === userId);
      return record ? record.status : 'PRESENT'; // Default to PRESENT if not found
    }
    return 'PRESENT';
  }

  savePrograms() {
    this.localStorageService.setItem('programs', this.programs);
  }
}
