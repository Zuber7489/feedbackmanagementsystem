export type Role = 'ADMIN' | 'COORDINATOR' | 'PARTICIPANT';

export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    createdAt: string;
}

export interface Course {
    id: string;
    code: string;
    title: string;
    description: string;
    durationDays: number;
    createdAt: string;
}

export interface Faculty {
    id: string;
    name: string;
    email: string;
    skills: string[];
}

export type AttendanceStatus = 'REGISTERED' | 'ATTENDED' | 'NO_SHOW';

export interface Enrollment {
    participantId: string;
    attendanceStatus: AttendanceStatus;
}

export type ProgramStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Program {
    id: string;
    courseId: string;
    coordinatorId: string;
    facultyIds: string[];
    startDate: string;
    endDate: string;
    location: string;
    capacity: number;
    status: ProgramStatus;
    enrollments: Enrollment[];
    createdAt: string;
}

export interface FeedbackRatings {
    q1: number;
    q2: number;
    q3: number;
    overall: number;
}

export interface Feedback {
    id: string;
    programId: string;
    participantId: string;
    ratings: FeedbackRatings;
    comments: string;
    submittedAt: string;
}
