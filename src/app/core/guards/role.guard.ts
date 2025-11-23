import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/models';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const expectedRoles = route.data['roles'] as Role[];

    if (!authService.isLoggedIn()) {
        return router.createUrlTree(['/login']);
    }

    const userRole = authService.currentUser()?.role;

    if (userRole && expectedRoles.includes(userRole)) {
        return true;
    }

    // Redirect to appropriate dashboard based on role or home
    if (userRole === 'ADMIN') return router.createUrlTree(['/admin']);
    if (userRole === 'COORDINATOR') return router.createUrlTree(['/coordinator']);
    if (userRole === 'PARTICIPANT') return router.createUrlTree(['/participant']);

    return router.createUrlTree(['/login']);
};
