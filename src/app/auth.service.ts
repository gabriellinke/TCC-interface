import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  private isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    return Date.now() > parseInt(expiresAt || '0');
  }

  public isAuthenticated(): boolean {
    return !this.isTokenExpired();
  }
}
