import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebcamImage } from 'ngx-webcam';
import { CommonModule } from '@angular/common';
import { UtilsService } from './../utils.service';
import { BackendService } from '../backend.service';
import { CameraComponent } from '../camera/camera.component';
import { BAKEND_ASSET_ALREADY_IN_FILE, BAKEND_ASSET_INVALID_CONDITION, BAKEND_ASSET_MORE_THAN_ONE_RESPONSIBLE, BAKEND_ASSET_NOT_FOUND, BAKEND_FILE_INCOMPLETE_ASSETS, BAKEND_FILE_INVALID_ASSETS, BAKEND_USER_ALREADY_HAS_FILE, FORBIDDEN_403 } from '../../constants/constants';
import { ActivatedRoute } from '@angular/router';
import { AssetInterfaceSimplified } from '../../interfaces/AssetInterfaceSimplified';
import { OverlayComponent } from '../overlay/overlay.component';

@Component({
  selector: 'app-file-generation',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, CameraComponent, OverlayComponent],
  templateUrl: './file-generation.component.html',
  styleUrl: './file-generation.component.css'
})
export class FileGenerationComponent {
  public backendService: BackendService = inject(BackendService);
  public utilsService: UtilsService = inject(UtilsService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public router: Router = inject(Router);
  public webcamImage: WebcamImage | null = null;
  public currentAsset: AssetInterfaceSimplified;

  public state: number = 2;
  public temporaryAssetNumber: string | undefined = undefined;
  public assetNumberConfidence: string | undefined = undefined;

  constructor() {
    console.log(this.router.getCurrentNavigation()?.extras.state?.['data']);
    this.currentAsset = this.router.getCurrentNavigation()?.extras.state?.['data'];
    if(!this.currentAsset || !this.currentAsset.id) {
      this.state = 3;
    } else if(this.currentAsset.assetNumber === "") {
      if(this.currentAsset.mainImage !== "") {
        this.reconizeAsset();
      }
    } else {
      this.state = 6;
    }
  };

  public getImageCount(): number {
    return this.utilsService.getImageCount(this.currentAsset);
  }

  public isAssetComplete(): boolean {
    return this.utilsService.isAssetComplete(this.currentAsset);
  }

/**----------------------------------------------------------------------------------------------------------- */
  public clearImage(numberOfStates: number = 1): void {
    this.webcamImage = null;
    this.state = this.state-numberOfStates;
  }

  onImageCaptured(image: WebcamImage): void {
    this.webcamImage = image;
    this.state = this.state+1;
  }

  public createAsset() {
    const fileId = this.currentAsset.fileId;
    if(fileId && this.webcamImage?.imageAsDataUrl){
      this.backendService.createAsset(fileId, this.webcamImage.imageAsDataUrl).subscribe({
        next: data => {
          this.currentAsset = {
            id: data.assetId,
            fileId: fileId,
            assetNumber: "",
            mainImage: data.mainImage,
            images: []
          }
          if(data.confidenceLevel && (parseFloat(data.confidenceLevel) > 0.5)) {
            console.log('Asset created:', data);
            this.temporaryAssetNumber = data.assetNumber;
            this.assetNumberConfidence = data.confidenceLevel;
            this.state = this.state+1;
          } else {
            alert("Não foi possível obter o número de patrimônio");
            this.deleteAsset();
          }
        },
        error: error => {
          if(error.message === BAKEND_FILE_INCOMPLETE_ASSETS) {
            alert(error.message);
          }
          console.error(error.message);
        }
      });
    }
  }

  public deleteAsset() {
    const fileId = this.currentAsset.fileId;
    if(this.currentAsset.id){
      this.backendService.deleteAsset(this.currentAsset.id).subscribe({
        next: data => {
          console.log('Asset deleted:', data);
          this.state = 3;
          this.currentAsset = {
            id: undefined,
            fileId: fileId,
            assetNumber: "",
            mainImage: "",
            images: []
          }
        },
        error: error => {
          console.error('Error deleting asset:', error);
          alert("Erro ao deletar bem");
        }
      });
    }
  }

  public reconizeAsset() {
    this.backendService.recognizeAssetNumber(this.currentAsset.id || 0).subscribe({
      next: data => {
        this.currentAsset = {
          id: data.assetId,
          fileId: data.fileId,
          assetNumber: "",
          mainImage: data.mainImage,
          images: []
        }
        if(data.confidenceLevel && (parseFloat(data.confidenceLevel) > 0.5)) {
          console.log('Recognizing asset number:', data);
          this.temporaryAssetNumber = data.assetNumber;
          this.assetNumberConfidence = data.confidenceLevel;
          this.state = 5;
        } else {
          alert("Não foi possível obter o número de patrimônio");
          this.deleteAsset();
        }
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  public confirmAsset() {
    if(this.currentAsset.id && this.temporaryAssetNumber){
      this.backendService.confirmAsset(this.currentAsset.id, this.temporaryAssetNumber).subscribe({
        next: data => {
          console.log('Asset confirmed');
          this.currentAsset = {
            id: this.currentAsset.id,
            fileId: this.currentAsset.fileId,
            assetNumber: this.temporaryAssetNumber || "",
            mainImage: this.currentAsset.mainImage,
            images: []
          }
          this.state = this.state+1;
        },
        error: error => {
          if(error.message == BAKEND_ASSET_NOT_FOUND ||
            BAKEND_ASSET_INVALID_CONDITION ||
            BAKEND_ASSET_MORE_THAN_ONE_RESPONSIBLE ||
            BAKEND_ASSET_ALREADY_IN_FILE) {
            alert(error.message);
          }
          console.error(error.message);
        }
      });
    }
  }

  public addImageToAsset() {
    if(this.currentAsset.id && this.webcamImage?.imageAsDataUrl){
      this.backendService.addImageToAsset(this.currentAsset.id, this.webcamImage.imageAsDataUrl).subscribe({
        next: data => {
          console.log('Image added to asset:', data);
          this.currentAsset.images.push(data.path);
          this.state = this.state+1;
        },
        error: error => {
          console.error('Error adding image to asset:', error);
          alert("Não foi possível adicionar imagem ao bem");
        }
      });
    }
  }

  public confirmFile() {
    if(this.currentAsset.fileId && this.isAssetComplete()){
      this.backendService.confirmFile(this.currentAsset.fileId).subscribe({
        next: data => {
          console.log('File confirmed:', data);
          this.router.navigate(['/']);
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

  public resetVariablesForNewAsset() {
    this.state = 3;
    this.webcamImage = null;
    this.temporaryAssetNumber = undefined;
    this.assetNumberConfidence = undefined;
    this.currentAsset = {
      id: undefined,
      fileId: this.currentAsset.fileId,
      assetNumber: "",
      mainImage: "",
      images: []
    }
  }
}
