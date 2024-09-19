import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const auth = inject(AuthService);

  if (!auth.isAuthenticated()) {
    router.navigate(['login']);
    return false;
  }
  return true;
};
