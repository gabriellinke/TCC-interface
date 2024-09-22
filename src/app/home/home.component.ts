import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackendService } from '../backend.service';
import { CameraComponent } from '../camera/camera.component';
import { BAKEND_FILE_INVALID_ASSETS, BAKEND_USER_ALREADY_HAS_FILE } from '../../constants/constants';
import { FileInterface } from '../../interfaces/FileInterface';
import { AssetInterface } from './../../interfaces/AssetInterface';
import { Router } from '@angular/router';
import { AssetInterfaceSimplified } from '../../interfaces/AssetInterfaceSimplified';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, CameraComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public backendService: BackendService = inject(BackendService);
  public router: Router = inject(Router);
  public files: FileInterface[] = [];
  public incompleteAsset: AssetInterface | undefined = undefined;
  public assets: AssetInterface[] = [];
  public unconsolidatedFile: FileInterface | undefined;

  constructor() {
    this.backendService.getFiles().subscribe({
      next: data => {
        console.log("Get Files", data);
        this.files = data;
        this.unconsolidatedFile = this.files.find(file => file.consolidated === false);
        if(this.unconsolidatedFile) {
          this.backendService.getAssetsByFileId(this.unconsolidatedFile.id).subscribe({
            next: data => {
              console.log('Got assets by fileId:', data);
              this.assets = data;
              this.incompleteAsset = data.find(asset => !this.isAssetComplete(asset));
            },
            error: error => {
              console.error(error.message);
            }
          });
        }
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  public isAssetComplete(asset: AssetInterface): boolean {
    return asset.mainImage !== "" && asset.assetNumber !== "" && asset.images.length >= 2;
  }

  public handleFileAction() {
    if (this.unconsolidatedFile) {
      this.redirectToPage();
    } else {
      this.createFile();
    }
  }

  public redirectToPage() {
    let asset: AssetInterfaceSimplified = {
      id: undefined,
      fileId: this.unconsolidatedFile?.id || 0,
      assetNumber: "",
      mainImage: "",
      images: []
    }
    if(this.incompleteAsset) {
      asset = {
        id: this.incompleteAsset.id,
        fileId: this.incompleteAsset.fileId,
        assetNumber: this.incompleteAsset.assetNumber,
        mainImage: this.incompleteAsset.mainImage,
        images: this.incompleteAsset.images
      }
    }

    this.router.navigate([`/generate`], {state: {data: asset}});
  }

  public createFile() {
    this.backendService.createFile().subscribe({
      next: data => {
        console.log('File created:', data);
        this.redirectToPage()
      },
      error: error => {
        if(error.message === BAKEND_USER_ALREADY_HAS_FILE) {
          alert(error.message);
        }
        console.error(error.message);
      }
    });
  }

  public generateFile() {
    if(this.assets.length > 0 && this.unconsolidatedFile?.id){
      this.backendService.confirmFile(this.unconsolidatedFile?.id).subscribe({
        next: data => {
          console.log('File generated:', data);
        },
        error: error => {
          if(error.message === BAKEND_FILE_INVALID_ASSETS) {
            alert(error.message);
          }
          console.error(error.message);
        }
      });
    }
  }
}
