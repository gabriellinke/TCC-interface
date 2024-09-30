import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { UtilsService } from '../utils.service';
import { AssetInterface } from '../../interfaces/AssetInterface';
import { CommonModule } from '@angular/common';
import { AssetInfoCardComponent } from '../asset-info-card/asset-info-card.component';
import { BACKEND_FILE_INVALID_ASSETS } from '../../constants/constants';
import { AssetInterfaceSimplified } from '../../interfaces/AssetInterfaceSimplified';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-file-info',
  standalone: true,
  imports: [CommonModule, AssetInfoCardComponent, HeaderComponent],
  templateUrl: './file-info.component.html',
  styleUrl: './file-info.component.css'
})
export class FileInfoComponent {
  public backendService: BackendService = inject(BackendService);
  public utilsService: UtilsService = inject(UtilsService);
  public router: Router = inject(Router);
  public route = inject(ActivatedRoute);
  public fileId: number;
  public assets: AssetInterface[] = [];

  constructor() {
    this.fileId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.backendService.getAssetsByFileId(this.fileId).subscribe({
      next: data => {
        console.log('Got assets by fileId:', data);
        this.assets = data;
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  goToAsset(assetId: number): void {
    this.router.navigate([`info/${this.fileId}/asset/${assetId}`]);
  }

  public areAllAssetsComplete(): boolean {
    return this.assets.every(asset => this.utilsService.isAssetComplete(asset));
  }

  public handleAssetAction() {
    if(this.assets.length > 0 && this.areAllAssetsComplete()) {
      this.backendService.confirmFile(this.fileId).subscribe({
        next: data => {
          console.log('File confirmed:', data);
          this.router.navigate(['/']);
        },
        error: error => {
          if(error.message === BACKEND_FILE_INVALID_ASSETS) {
            alert(error.message);
          }
          console.error(error.message);
        }
      });
    } else {
      const incompleteAsset = this.assets.find(asset => !this.utilsService.isAssetComplete(asset));
      let asset: AssetInterfaceSimplified = {
        id: incompleteAsset?.id,
        fileId: this.fileId,
        assetNumber: incompleteAsset?.assetNumber || "",
        mainImage: incompleteAsset?.mainImage || "",
        images: incompleteAsset?.images || []
      };
      this.router.navigate([`/generate`], {state: {data: asset}});
    }
  }

  public handleAddAsset() {
    let asset: AssetInterfaceSimplified = {
      id: undefined,
      fileId: this.fileId,
      assetNumber: "",
      mainImage: "",
      images: []
    };
    this.router.navigate([`/generate`], {state: {data: asset}});
  }
}
