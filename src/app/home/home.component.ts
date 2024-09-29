import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackendService } from '../backend.service';
import { UtilsService } from './../utils.service';
import { CameraComponent } from '../camera/camera.component';
import { BACKEND_USER_ALREADY_HAS_FILE } from '../../constants/constants';
import { FileInterface } from '../../interfaces/FileInterface';
import { AssetInterface } from './../../interfaces/AssetInterface';
import { Router } from '@angular/router';
import { AssetInterfaceSimplified } from '../../interfaces/AssetInterfaceSimplified';
import { DownloadCardComponent } from '../download-card/download-card.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, CameraComponent, DownloadCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public backendService: BackendService = inject(BackendService);
  public utilsService: UtilsService = inject(UtilsService);
  public router: Router = inject(Router);
  public files: FileInterface[] = [];
  public consolidateFiles: FileInterface[] = [];
  public unconsolidatedFile: FileInterface | undefined;

  constructor() {
    this.backendService.getFiles().subscribe({
      next: data => {
        console.log("Get Files", data);
        this.files = data;
        this.unconsolidatedFile = this.files.find(file => file.consolidated === false);
        this.consolidateFiles = this.files.filter(file => file.consolidated === true);
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  public isAssetComplete(asset: AssetInterface): boolean {
    return this.utilsService.isAssetComplete(asset);
  }

  public handleFileAction() {
    if (this.unconsolidatedFile) {
      this.router.navigate([`/info/${this.unconsolidatedFile.id}`]);
    } else {
      this.createFile();
    }
  }

  public createFile() {
    this.backendService.createFile().subscribe({
      next: data => {
        console.log('File created:', data);
        let asset: AssetInterfaceSimplified = {
          id: undefined,
          fileId: data.id,
          assetNumber: "",
          mainImage: "",
          images: []
        }
        this.router.navigate([`/generate`], {state: {data: asset}});
      },
      error: error => {
        if(error.message === BACKEND_USER_ALREADY_HAS_FILE) {
          alert(error.message);
        }
        console.error(error.message);
      }
    });
  }
}
