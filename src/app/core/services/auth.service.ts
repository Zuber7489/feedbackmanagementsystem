import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { User, Role } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly USERS_KEY = 'users';
    private readonly CURRENT_USER_KEY = 'currentUser';

    currentUser = signal<User | null>(null);
    isLoggedIn = computed(() => !!this.currentUser());
    isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
    isCoordinator = computed(() => this.currentUser()?.role === 'COORDINATOR');
    isParticipant = computed(() => this.currentUser()?.role === 'PARTICIPANT');

    constructor(
        private localStorageService: LocalStorageService,
        private router: Router
    ) {
        this.loadSession();
        this.seedAdmin(); // Ensure at least one admin exists
    }

    private loadSession(): void {
        const storedUser = sessionStorage.getItem(this.CURRENT_USER_KEY);
        if (storedUser) {
            try {
                this.currentUser.set(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error loading session:', e);
                sessionStorage.removeItem(this.CURRENT_USER_KEY);
            }
        }
    }

    login(email: string, password: string): boolean {
        const users = this.localStorageService.getItem<User[]>(this.USERS_KEY) || [];
        // In a real app, we would hash the password. Here we compare directly or a simple hash if we had one.
        // For this mock, let's assume passwordHash is just the password for simplicity, or we can add a simple hash function.
        // Requirement says "passwordHash", so let's assume the stored user has a hash.
        // For simplicity in this frontend-only mock, we'll just compare plain text for now or simple "hash".

        const user = users.find(u => u.email === email && u.passwordHash === password);

        if (user) {
            this.currentUser.set(user);
            sessionStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
            return true;
        }
        return false;
    }

    logout(): void {
        this.currentUser.set(null);
        sessionStorage.removeItem(this.CURRENT_USER_KEY);
        this.router.navigate(['/login']);
    }

    register(user: User): boolean {
        const users = this.localStorageService.getItem<User[]>(this.USERS_KEY) || [];
        if (users.some(u => u.email === user.email)) {
            return false; // User already exists
        }
        users.push(user);
        this.localStorageService.setItem(this.USERS_KEY, users);
        return true;
    }

    private seedAdmin(): void {
        const users = this.localStorageService.getItem<User[]>(this.USERS_KEY) || [];
        if (!users.some(u => u.role === 'ADMIN')) {
            const admin: User = {
                id: 'admin-1',
                name: 'System Admin',
                email: 'admin@fms.com',
                passwordHash: 'admin123', // Default password
                role: 'ADMIN',
                createdAt: new Date().toISOString()
            };
            users.push(admin);
            this.localStorageService.setItem(this.USERS_KEY, users);
        }
    }
}
