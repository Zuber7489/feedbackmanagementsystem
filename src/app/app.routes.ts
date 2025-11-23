import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent } from './features/admin/dashboard/dashboard';
import { CourseListComponent } from './features/admin/courses/course-list/course-list';
import { CourseFormComponent } from './features/admin/courses/course-form/course-form';
import { FacultyListComponent } from './features/admin/faculties/faculty-list/faculty-list';
import { FacultyFormComponent } from './features/admin/faculties/faculty-form/faculty-form';
import { UserListComponent } from './features/admin/users/user-list/user-list';
import { UserFormComponent } from './features/admin/users/user-form/user-form';
import { ReportsComponent } from './features/admin/reports/reports';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { DashboardComponent as CoordinatorDashboardComponent } from './features/coordinator/dashboard/dashboard';
import { ProgramListComponent } from './features/coordinator/programs/program-list/program-list';
import { ProgramFormComponent } from './features/coordinator/programs/program-form/program-form';
import { EnrollmentComponent } from './features/coordinator/enrollment/enrollment';

import { DashboardComponent as ParticipantDashboardComponent } from './features/participant/dashboard/dashboard';
import { FeedbackFormComponent } from './features/participant/feedback-form/feedback-form';

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
            { path: 'users/new', component: UserFormComponent },
            { path: 'users/edit/:id', component: UserFormComponent },
            { path: 'reports', component: ReportsComponent },
        ]
    },
    {
        path: 'coordinator',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['COORDINATOR', 'ADMIN'] },
        children: [
            { path: '', component: CoordinatorDashboardComponent },
            { path: 'programs', component: ProgramListComponent },
            { path: 'programs/new', component: ProgramFormComponent },
            { path: 'programs/edit/:id', component: ProgramFormComponent },
            { path: 'enrollments', component: EnrollmentComponent },
        ]
    },
    {
        path: 'participant',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['PARTICIPANT', 'ADMIN'] },
        children: [
            { path: '', component: ParticipantDashboardComponent },
            { path: 'feedback/:programId', component: FeedbackFormComponent },
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
