import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebcamImage } from 'ngx-webcam';
import { CommonModule } from '@angular/common';
import { BackendService } from './backend.service';
import { CameraComponent } from './camera/camera.component';
import { BAKEND_ASSET_ALREADY_IN_FILE, BAKEND_ASSET_INVALID_CONDITION, BAKEND_ASSET_MORE_THAN_ONE_RESPONSIBLE, BAKEND_ASSET_NOT_FOUND, BAKEND_FILE_INCOMPLETE_ASSETS, BAKEND_FILE_INVALID_ASSETS, BAKEND_USER_ALREADY_HAS_FILE, FORBIDDEN_403 } from '../constants/constants';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, CameraComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public backendService: BackendService = inject(BackendService);
  public processedImage: string | null = null;
  public webcamImage: WebcamImage | null = null;

  public state: number = 1;
  public imageCount: number = 0;
  public fileId: number | undefined = undefined;
  public assetId: number | undefined = undefined;
  public assetNumber: string | undefined = undefined;
  public assetNumberConfidence: string | undefined = undefined;
  public assetNumberUpdateEnabled: boolean = false;
  public file: string | undefined = undefined;

/**----------------------------------------------------------------------------------------------------------- */
  public clearImage(numberOfStates: number = 1): void {
    this.webcamImage = null;
    this.state = this.state-numberOfStates;
  }

  onImageCaptured(image: WebcamImage): void {
    this.webcamImage = image;
    this.state = this.state+1;
  }

  public enableAssetNumberUpdate() {
    this.assetNumberUpdateEnabled = true;
  }

  public login(email: string, password: string) {
    this.backendService.login(email, password).subscribe({
      next: data => {
        console.log('Logged in successfully:', data);
        this.state = this.state + 1;
      },
      error: error => {
        if(error.message === FORBIDDEN_403) {
          alert(error.message);
        }
        console.error(error.message);
      }
    });
  }

  public createFile() {
    this.backendService.createFile().subscribe({
      next: data => {
        console.log('File created:', data);
        this.fileId = data.id;
        this.state = this.state + 1;
      },
      error: error => {
        if(error.message === BAKEND_USER_ALREADY_HAS_FILE) {
          alert(error.message);
        }
        console.error(error.message);
      }
    });
  }

  public createAsset() {
    if(this.fileId && this.webcamImage?.imageAsDataUrl){
      this.backendService.createAsset(this.fileId, this.webcamImage.imageAsDataUrl).subscribe({
        next: data => {
          if(data.confidenceLevel && (parseFloat(data.confidenceLevel) > 0.5)) {
            console.log('Asset created:', data);
            this.assetNumber = data.assetNumber;
            this.assetNumberConfidence = data.confidenceLevel;
            this.processedImage = data.mainImage;
            this.assetId = data.assetId;
            this.state = this.state+1;
            this.imageCount = this.imageCount+1;
          } else {
            alert("Não foi possível obter o número de patrimônio");
            this.assetId = data.assetId;
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
    if(this.assetId){
      this.backendService.deleteAsset(this.assetId).subscribe({
        next: data => {
          console.log('Asset deleted:', data);
          this.state = 3;
          this.imageCount = 0;
        },
        error: error => {
          console.error('Error deleting asset:', error);
          alert("Erro ao deletar bem");
        }
      });
    }
  }

  public confirmAsset() {
    if(this.assetId && this.assetNumber){
      this.backendService.confirmAsset(this.assetId, this.assetNumber).subscribe({
        next: data => {
          console.log('Asset confirmed:', data);
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
    if(this.assetId && this.webcamImage?.imageAsDataUrl){
      this.backendService.addImageToAsset(this.assetId, this.webcamImage.imageAsDataUrl).subscribe({
        next: data => {
          console.log('Image added to asset:', data);
          this.state = this.state+1;
          this.imageCount = this.imageCount+1;
        },
        error: error => {
          console.error('Error adding image to asset:', error);
          alert("Não foi possível adicionar imagem ao bem");
        }
      });
    }
  }

  public confirmFile() {
    if(this.fileId && this.imageCount >= 3){
      this.backendService.confirmFile(this.fileId).subscribe({
        next: data => {
          console.log('File confirmed:', data);
          this.file = data.filename;
          this.state = this.state+1;
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

  public resetVariables() {
    this.state = 1;
    this.webcamImage = null;
    this.imageCount = 0;
    this.fileId = undefined;
    this.assetId = undefined;
    this.assetNumber = undefined;
    this.assetNumberConfidence = undefined;
    this.assetNumberUpdateEnabled = false;
    this.file = undefined;
  }

  public resetVariablesForNewAsset() {
    this.state = 3;
    this.webcamImage = null;
    this.imageCount = 0;
    this.assetId = undefined;
    this.assetNumber = undefined;
    this.assetNumberConfidence = undefined;
    this.assetNumberUpdateEnabled = false;
  }
}
