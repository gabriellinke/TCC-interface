import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/LoginResponse';
import { CreateFileResponse } from './../interfaces/CreateFileResponse';
import { CreateAssetResponse } from '../interfaces/CreateAssetResponse';
import { AddImageResponse } from '../interfaces/AddImageResponse';
import { ConfirmFileResponse } from '../interfaces/ConfirmFileResponse';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  // baseUrl = 'http://localhost:8080';
  baseUrl = 'https://192.168.0.177:8443';
  // baseUrl = 'https://backend.tcc.utfpr';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      tap((data: LoginResponse) => {
        // Armazena o token e a timestamp de expiração no localStorage
        localStorage.setItem('token', data.token);
        const expiresAt = Date.now() + data.expiresIn;
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      })
    );
  }

  createFile(): Observable<CreateFileResponse> {
    const url = `${this.baseUrl}/file`;
    return this.http.post<CreateFileResponse>(url, null);
  }

  createAsset(fileId: number, image: string): Observable<CreateAssetResponse> {
    const url = `${this.baseUrl}/asset`;
    return this.http.get(image, { responseType: 'blob' })
      .pipe(
        switchMap(blob => {
          const formData = new FormData();
          formData.append('image', blob);
          formData.append('fileId', fileId.toString());

          return this.http.post<CreateAssetResponse>(url, formData);
        })
      );
  }

  deleteAsset(assetId:number): Observable<any> {
    const url = `${this.baseUrl}/asset/${assetId}`;
    return this.http.delete<CreateFileResponse>(url);
  }

  confirmAsset(assetId: number, assetNumber: string): Observable<any> {
    const url = `${this.baseUrl}/asset/confirm/${assetId}`;
    const body = { assetNumber }
    return this.http.post(url, body);
  }

  addImageToAsset(assetId: number, image: string): Observable<AddImageResponse>{
    const url = `${this.baseUrl}/asset/add-image`;
    return this.http.get(image, { responseType: 'blob' })
      .pipe(
        switchMap(blob => {
          const formData = new FormData();
          formData.append('image', blob);
          formData.append('assetId', assetId.toString());

          return this.http.post<AddImageResponse>(url, formData);
        })
      );
  }

  confirmFile(fileId: number): Observable<ConfirmFileResponse> {
    const url = `${this.baseUrl}/file/${fileId}/confirm`;
    return this.http.post<ConfirmFileResponse>(url, null);
  }
}
