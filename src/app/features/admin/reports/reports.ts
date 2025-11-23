import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Program, Course, User, Faculty, Feedback, AttendanceStatus } from '../../../core/models/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);

  programs: Program[] = [];
  courses: Course[] = [];
  users: User[] = [];
  faculties: Faculty[] = [];
  feedbacks: Feedback[] = [];

  activeTab: 'programs' | 'defaulters' | 'faculty' = 'programs';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.programs = this.localStorageService.getItem<Program[]>('programs') || [];
    this.courses = this.localStorageService.getItem<Course[]>('courses') || [];
    this.users = this.localStorageService.getItem<User[]>('users') || [];
    this.faculties = this.localStorageService.getItem<Faculty[]>('faculties') || [];
    this.feedbacks = this.localStorageService.getItem<Feedback[]>('feedbacks') || [];
  }

  getCourseTitle(courseId: string): string {
    return this.courses.find(c => c.id === courseId)?.title || 'Unknown Course';
  }

  getFacultyName(facultyId: string): string {
    return this.faculties.find(f => f.id === facultyId)?.name || 'Unknown Faculty';
  }

  // Program Summary Helpers
  getEnrollmentCount(program: Program): number {
    return program.enrolledUserIds?.length || 0;
  }

  getAverageRating(programId: string): string {
    const programFeedbacks = this.feedbacks.filter(f => f.programId === programId);
    if (programFeedbacks.length === 0) return 'N/A';

    const total = programFeedbacks.reduce((sum, f) => sum + f.ratings.overall, 0);
    return (total / programFeedbacks.length).toFixed(1);
  }

  // Defaulters Helpers
  getDefaulters(): { user: User, program: Program, attendancePercentage: number }[] {
    const defaulters: { user: User, program: Program, attendancePercentage: number }[] = [];

    this.programs.forEach(program => {
      if (program.enrolledUserIds && program.attendance) {
        program.enrolledUserIds.forEach(userId => {
          const userRecords = program.attendance.filter(a => a.userId === userId);
          const course = this.courses.find(c => c.id === program.courseId);
          const requiredDays = course?.durationDays || 5; // Default to 5 if not specified

          // Count PRESENT or LATE as attended
          const attendedDays = userRecords.filter(a => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE).length;

          // If attendance records are less than required days, we can assume absent for missing days if program is completed?
          // Or just calculate based on recorded attendance.
          // Let's assume we track attendance daily.

          // Simple logic: if attendance percentage < 75%
          // If no attendance records, 0%

          let percentage = 0;
          if (requiredDays > 0) {
            percentage = (attendedDays / requiredDays) * 100;
          }

          if (percentage < 75) {
            const user = this.users.find(u => u.id === userId);
            if (user) {
              defaulters.push({ user, program, attendancePercentage: percentage });
            }
          }
        });
      }
    });
    return defaulters;
  }

  // Faculty Performance Helpers
  getFacultyPerformance(): { faculty: Faculty, averageRating: number, feedbackCount: number }[] {
    return this.faculties.map(faculty => {
      // Find all programs by this faculty
      const facultyPrograms = this.programs.filter(p => p.facultyId === faculty.id);
      const programIds = facultyPrograms.map(p => p.id);

      // Find all feedbacks for these programs
      const facultyFeedbacks = this.feedbacks.filter(f => programIds.includes(f.programId));

      let averageRating = 0;
      if (facultyFeedbacks.length > 0) {
        const total = facultyFeedbacks.reduce((sum, f) => sum + f.ratings.overall, 0);
        averageRating = total / facultyFeedbacks.length;
      }

      return {
        faculty,
        averageRating,
        feedbackCount: facultyFeedbacks.length
      };
    });
  }

  exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (this.activeTab === 'programs') {
      csvContent += "Program ID,Course,Faculty,Start Date,End Date,Status,Enrollments,Avg Rating\n";
      this.programs.forEach(p => {
        const row = [
          p.id,
          this.getCourseTitle(p.courseId),
          this.getFacultyName(p.facultyId),
          p.startDate,
          p.endDate,
          p.status,
          this.getEnrollmentCount(p),
          this.getAverageRating(p.id)
        ].join(",");
        csvContent += row + "\n";
      });
    } else if (this.activeTab === 'defaulters') {
      csvContent += "User Name,Email,Program,Attendance %\n";
      this.getDefaulters().forEach(d => {
        const row = [
          d.user.name,
          d.user.email,
          this.getCourseTitle(d.program.courseId),
          d.attendancePercentage.toFixed(1) + '%'
        ].join(",");
        csvContent += row + "\n";
      });
    } else if (this.activeTab === 'faculty') {
      csvContent += "Faculty Name,Email,Avg Rating,Feedback Count\n";
      this.getFacultyPerformance().forEach(f => {
        const row = [
          f.faculty.name,
          f.faculty.email,
          f.averageRating.toFixed(1),
          f.feedbackCount
        ].join(",");
        csvContent += row + "\n";
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${this.activeTab}_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
