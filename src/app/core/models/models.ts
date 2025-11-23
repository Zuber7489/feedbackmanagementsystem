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

export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE',
    ON_LEAVE = 'ON_LEAVE'
}

export interface AttendanceRecord {
    userId: string;
    status: AttendanceStatus;
    date: string;
}

export type ProgramStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Program {
    id: string;
    courseId: string;
    facultyId: string; // Changed from facultyIds: string[] to single facultyId as per form
    startDate: string;
    endDate: string;
    status: ProgramStatus;
    enrolledUserIds: string[];
    attendance: AttendanceRecord[];
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
