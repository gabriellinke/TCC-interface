import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackendService } from '../backend.service';
import { UtilsService } from '../utils.service';
import { AssetInterface } from '../../interfaces/AssetInterface';
import { AssetInterfaceSimplified } from '../../interfaces/AssetInterfaceSimplified';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from './../footer/footer.component';
import { DeviceService } from '../device.service';
import { OverlayComponent } from '../overlay/overlay.component';

@Component({
  selector: 'app-asset-info',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, OverlayComponent],
  templateUrl: './asset-info.component.html',
  styleUrl: './asset-info.component.css'
})
export class AssetInfoComponent implements OnInit{
  public backendService: BackendService = inject(BackendService);
  public utilsService: UtilsService = inject(UtilsService);
  public deviceService: DeviceService = inject(DeviceService);
  public router: Router = inject(Router);
  public route = inject(ActivatedRoute);
  public fileId: number;
  public assetId: number;
  public asset: AssetInterface | undefined;
  public isMobileDevice: boolean = false;
  public isDeletingAsset: boolean = false
  public imageToDelete: string = "";
  public loading: boolean = true
  public loadingOverlay: boolean = false

  constructor() {
    this.fileId = parseInt(this.route.snapshot.paramMap.get('file_id') || '0');
    this.assetId = parseInt(this.route.snapshot.paramMap.get('asset_id') || '0');
    this.updateInfo();
  }

  ngOnInit(): void {
    this.deviceService.mobileDevice$.subscribe(isMobile => {
      this.isMobileDevice = isMobile;
    });
  }

  public updateInfo() {
    this.loading = true;
    this.backendService.getAssetsByFileId(this.fileId).subscribe({
      next: data => {
        console.log('Got assets by fileId:', data);
        this.asset = data.find(asset => asset.id === this.assetId);
        this.loading = false;
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  public setImageToDeletion(image: string) {
    this.imageToDelete = image;
  }

  public cancelImageDeletion() {
    this.imageToDelete = "";
  }

  public setAssetToDeletion() {
    this.isDeletingAsset = true;
  }

  public cancelAssetDeletion() {
    this.isDeletingAsset = false;
  }

  public deleteImage() {
    this.loadingOverlay = true;
    const image = this.imageToDelete;
    const filename = image.substring(image.lastIndexOf('/')+1);
    this.backendService.deleteImage(filename).subscribe({
      next: data => {
        console.log('Deleted image');
        this.loadingOverlay = false;
        this.cancelImageDeletion();
        this.updateInfo();
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  public deleteAsset() {
    this.loadingOverlay = true;
    this.backendService.deleteAsset(this.assetId).subscribe({
      next: data => {
        console.log('Deleted asset');
        this.router.navigate([`/info/${this.fileId}`]);
        this.loadingOverlay = false;
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
