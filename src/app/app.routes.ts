import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent } from './features/admin/dashboard/dashboard';
import { CourseListComponent } from './features/admin/courses/course-list/course-list';
import { CourseFormComponent } from './features/admin/courses/course-form/course-form';
import { FacultyListComponent } from './features/admin/faculties/faculty-list/faculty-list';
import { FacultyFormComponent } from './features/admin/faculties/faculty-form/faculty-form';
import { UserListComponent } from './features/admin/users/user-list/user-list';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
            { path: '', component: DashboardComponent },
            { path: 'courses', component: CourseListComponent },
            { path: 'courses/new', component: CourseFormComponent },
            { path: 'courses/edit/:id', component: CourseFormComponent },
            { path: 'faculties', component: FacultyListComponent },
            { path: 'faculties/new', component: FacultyFormComponent },
            { path: 'faculties/edit/:id', component: FacultyFormComponent },
            { path: 'users', component: UserListComponent },
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
