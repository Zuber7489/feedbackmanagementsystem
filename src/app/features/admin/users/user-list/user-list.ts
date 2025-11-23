import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { User, Role } from '../../../../core/models/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserListComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);
  users: User[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.users = this.localStorageService.getItem<User[]>('users') || [];
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(u => u.id !== id);
      this.localStorageService.setItem('users', this.users);
    }
  }

  changeRole(user: User, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value as Role;

    if (confirm(`Are you sure you want to change role of ${user.name} to ${newRole}?`)) {
      user.role = newRole;
      this.localStorageService.setItem('users', this.users);
    } else {
      select.value = user.role; // Revert
    }
  }
}

