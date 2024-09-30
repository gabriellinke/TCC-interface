import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackendService } from '../backend.service';
import { UtilsService } from '../utils.service';
import { AssetInterface } from '../../interfaces/AssetInterface';
import { AssetInterfaceSimplified } from '../../interfaces/AssetInterfaceSimplified';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-asset-info',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './asset-info.component.html',
  styleUrl: './asset-info.component.css'
})
export class AssetInfoComponent {
  public backendService: BackendService = inject(BackendService);
  public utilsService: UtilsService = inject(UtilsService);
  public router: Router = inject(Router);
  public route = inject(ActivatedRoute);
  public fileId: number;
  public assetId: number;
  public asset: AssetInterface | undefined;

  constructor() {
    this.fileId = parseInt(this.route.snapshot.paramMap.get('file_id') || '0');
    this.assetId = parseInt(this.route.snapshot.paramMap.get('asset_id') || '0');
    this.updateInfo();
  }

  public updateInfo() {
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
    const filename = image.substring(image.lastIndexOf('/')+1);
    this.backendService.deleteImage(filename).subscribe({
      next: data => {
        console.log('Deleted image');
        this.updateInfo();
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  public deleteAsset() {
    console.log("Delete asset");
    this.backendService.deleteAsset(this.assetId).subscribe({
      next: data => {
        console.log('Deleted asset');
        this.router.navigate([`/info/${this.fileId}`]);
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  public updateAsset() {
    console.log("Update asset");
    let asset: AssetInterfaceSimplified = {
      id: this.asset?.id,
      fileId: this.fileId,
      description: this.asset?.description || "",
      responsible: this.asset?.responsible || "",
      assetNumber: this.asset?.assetNumber || "",
      mainImage: this.asset?.mainImage || "",
      images: this.asset?.images || []
    };
    this.router.navigate([`/generate`], {state: {data: asset}});
  }

}
