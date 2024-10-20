import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CreateFileResponse } from './../interfaces/CreateFileResponse';
import { CreateAssetResponse } from '../interfaces/CreateAssetResponse';
import { AddImageResponse } from '../interfaces/AddImageResponse';
import { ConfirmFileResponse } from '../interfaces/ConfirmFileResponse';
import { FileInterface } from '../interfaces/FileInterface';
import { AssetInterface } from './../interfaces/AssetInterface';
import { environment } from '../environments/environment';
import { AssetSearchInterface } from '../interfaces/AssetSearchInterface';
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getFiles(): Observable<FileInterface[]> {
    const url = `${this.baseUrl}/file`;

    return this.http.get<FileInterface[]>(url, { responseType: 'json' });
  }

  getAssetsByFileId(id: number): Observable<AssetInterface[]> {
    const url = `${this.baseUrl}/file/${id}/assets`;
    return this.http.get<AssetInterface[]>(url, { responseType: 'json' });
  }

  createFile(): Observable<CreateFileResponse> {
    const url = `${this.baseUrl}/file`;

    return this.http.post<CreateFileResponse>(url, null, { observe: 'response' }).pipe(
      map(response => response.body as CreateFileResponse)
    );
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
    return this.http.delete(url, { observe: 'response' });
  }

  confirmAsset(assetId: number, assetNumber: string): Observable<any> {
    const url = `${this.baseUrl}/asset/confirm/${assetId}`;
    const body = { assetNumber }
    return this.http.post(url, body);
  }

  recognizeAssetNumber(assetId: number): Observable<CreateAssetResponse> {
    const url = `${this.baseUrl}/asset/recognize/${assetId}`;
    return this.http.get<CreateAssetResponse>(url, { responseType: 'json' });
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

  deleteImage(filename:string): Observable<any> {
    const url = `${this.baseUrl}/asset/delete-image/${filename}`;
    return this.http.delete(url, { observe: 'response' });
  }

  searchAssetByAssetNumber(assetNumber: string): Observable<AssetSearchInterface> {
    const url = `${this.baseUrl}/patrimonio?tombo=${assetNumber}`;
    return this.http.get<AssetSearchInterface>(url, { responseType: 'json' });
  }

  searchAssetByFormerAssetNumber(formerAssetNumber: string): Observable<AssetSearchInterface> {
    const url = `${this.baseUrl}/patrimonio?tombo_antigo=${formerAssetNumber}`;
    return this.http.get<AssetSearchInterface>(url, { responseType: 'json' });
  }
}
