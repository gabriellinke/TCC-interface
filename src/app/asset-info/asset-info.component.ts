import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { UtilsService } from '../utils.service';
import { AssetInterface } from '../../interfaces/AssetInterface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-info.component.html',
  styleUrl: './asset-info.component.css'
})
export class AssetInfoComponent {
  public backendService: BackendService = inject(BackendService);
  public utilsService: UtilsService = inject(UtilsService);
  public router: Router = inject(Router);
  public route = inject(ActivatedRoute);
  public fileId: number = 0;
  public assetId: number = 0;
  public asset: AssetInterface | undefined;

  constructor() {
    this.initialize();
  }

  public initialize() {
    this.fileId = parseInt(this.route.snapshot.paramMap.get('file_id') || '0');
    this.assetId = parseInt(this.route.snapshot.paramMap.get('asset_id') || '0');
    this.backendService.getAssetsByFileId(this.fileId).subscribe({
      next: data => {
        console.log('Got assets by fileId:', data);
        this.asset = data.find(asset => asset.id === this.assetId);
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  public deleteImage(image: string) {
    console.log("Delete image: ", image);
  }

  public deleteAsset() {
    console.log("Delete asset");
  }

  public updateAsset() {
    console.log("Update asset");
  }

}
