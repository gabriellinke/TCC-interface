import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  // baseUrl = 'http://localhost:8080';
  baseUrl = 'https://backend.tcc.utfpr';

  constructor(private http: HttpClient) { }

  uploadImage(image: string): Observable<any> {
    return this.http.get(image, { responseType: 'blob' })
      .pipe(
        switchMap(blob => {
          const formData = new FormData();
          formData.append('image', blob, 'filename.jpg');

          return this.http.post(`${this.baseUrl}/upload`, formData);
        })
      );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<LoginResponse>(url, body, { headers }).pipe(
      tap((data: LoginResponse) => {
        // Armazena o token e a timestamp de expiração no localStorage
        localStorage.setItem('token', data.token);
        const expiresAt = Date.now() + data.expiresIn;
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      })
    );
  }

  createFile(): Observable<any> {
    const url = `${this.baseUrl}/file`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(url, null, { headers });
  }
}
