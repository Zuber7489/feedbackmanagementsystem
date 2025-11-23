import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { Faculty } from '../../../../core/models/models';

@Component({
  selector: 'app-faculty-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faculty-list.html',
  styleUrl: './faculty-list.css'
})
export class FacultyListComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);
  faculties: Faculty[] = [];

  ngOnInit() {
    this.loadFaculties();
  }

  loadFaculties() {
    this.faculties = this.localStorageService.getItem<Faculty[]>('faculties') || [];
  }

  deleteFaculty(id: string) {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      this.faculties = this.faculties.filter(f => f.id !== id);
      this.localStorageService.setItem('faculties', this.faculties);
    }
  }
}

