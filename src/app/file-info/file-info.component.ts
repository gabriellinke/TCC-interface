import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { UtilsService } from '../utils.service';
import { AssetInterface } from '../../interfaces/AssetInterface';
import { CommonModule } from '@angular/common';
import { AssetInfoCardComponent } from '../asset-info-card/asset-info-card.component';
import { BACKEND_FILE_INVALID_ASSETS } from '../../constants/constants';
import { AssetInterfaceSimplified } from '../../interfaces/AssetInterfaceSimplified';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { DeviceService } from '../device.service';

@Component({
    selector: 'app-file-info',
    imports: [CommonModule, AssetInfoCardComponent, HeaderComponent, FooterComponent],
    templateUrl: './file-info.component.html',
    styleUrl: './file-info.component.css'
})
export class FileInfoComponent implements OnInit{
  public backendService: BackendService = inject(BackendService);
  public utilsService: UtilsService = inject(UtilsService);
  public deviceService: DeviceService = inject(DeviceService);
  public router: Router = inject(Router);
  public route = inject(ActivatedRoute);
  public fileId: number;
  public assets: AssetInterface[] = [];
  public isMobileDevice: boolean = false;
  public loading: boolean = true;

  constructor() {
    this.fileId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.backendService.getAssetsByFileId(this.fileId).subscribe({
      next: data => {
        console.log('Got assets by fileId:', data);
        this.assets = data;
        this.loading = false;
      },
      error: error => {
        console.error(error);
      }
    });
  }

  ngOnInit(): void {
    this.deviceService.mobileDevice$.subscribe(isMobile => {
      this.isMobileDevice = isMobile;
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
      this.loading = true;
      this.backendService.confirmFile(this.fileId).subscribe({
        next: data => {
          console.log('File confirmed:', data);
          this.router.navigate(['/']);
        },
        error: error => {
          if(error.error.detail === BACKEND_FILE_INVALID_ASSETS) {
            alert(error);
          }
          console.error(error);
        }
      });
    } else {
      const incompleteAsset = this.assets.find(asset => !this.utilsService.isAssetComplete(asset));
      let asset: AssetInterfaceSimplified = {
        id: incompleteAsset?.id,
        fileId: this.fileId,
        description: incompleteAsset?.description || "",
        responsible: incompleteAsset?.responsible || "",
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
      description: "",
      responsible: "",
      assetNumber: "",
      mainImage: "",
      images: []
    };
    this.router.navigate([`/generate`], {state: {data: asset}});
  }
}
