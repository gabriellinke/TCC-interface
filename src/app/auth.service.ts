import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/LoginResponse';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  private isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    return Date.now() > parseInt(expiresAt || '0');
  }

  public isAuthenticated(): boolean {
    return !this.isTokenExpired();
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiresAt');
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body, { observe: 'response' }).pipe(
      tap((response: HttpResponse<LoginResponse>) => {
        const data = response.body;
        if (data) {
          localStorage.setItem('token', data.token);
          const expiresAt = Date.now() + data.expiresIn;
          localStorage.setItem('tokenExpiresAt', expiresAt.toString());
        }
      }),
      map(response => response.body as LoginResponse)
    );
  }

}
