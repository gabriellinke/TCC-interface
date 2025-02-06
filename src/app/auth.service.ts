import { Injectable, inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private oauthService: OAuthService = inject(OAuthService);

  getUserRoles(): string[] {
    const token = this.oauthService.getAccessToken();
    if (!token) return [];

    const decodedToken: any = jwtDecode(token);

    return decodedToken['resource_access']?.['tcc']?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }
}
