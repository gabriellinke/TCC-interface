import { OnboardingService } from './../onboarding.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebcamImage } from 'ngx-webcam';
import { CommonModule, Location } from '@angular/common';
import { UtilsService } from './../utils.service';
import { BackendService } from '../backend.service';
import { CameraComponent } from '../camera/camera.component';
import { BACKEND_ASSET_ALREADY_IN_FILE, BACKEND_ASSET_INVALID_CONDITION, BACKEND_ASSET_MORE_THAN_ONE_RESPONSIBLE, BACKEND_ASSET_NOT_FOUND, BACKEND_FILE_INCOMPLETE_ASSETS, BACKEND_FILE_INVALID_ASSETS } from '../../constants/constants';
import { ActivatedRoute } from '@angular/router';
import { AssetInterfaceSimplified } from '../../interfaces/AssetInterfaceSimplified';
import { OverlayComponent } from '../overlay/overlay.component';
import { FileGenerationStates } from '../file-generation-states';
import { OnboardingOverlayComponent } from '../onboardingOverlay/onboardingOverlay.component';
@Component({
    selector: 'app-file-generation',
    imports: [CommonModule, FormsModule, CameraComponent, OverlayComponent, OnboardingOverlayComponent],
    templateUrl: './file-generation.component.html',
    styleUrl: './file-generation.component.css'
})
export class FileGenerationComponent {
  public backendService: BackendService = inject(BackendService);
  public onboardingService: OnboardingService = inject(OnboardingService);
  public utilsService: UtilsService = inject(UtilsService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public router: Router = inject(Router);
  public webcamImage: WebcamImage | null = null;
  public currentAsset: AssetInterfaceSimplified;

  public fileStates = FileGenerationStates;
  public currentState: FileGenerationStates = FileGenerationStates.LOADING;
  public temporaryAssetNumber: string | undefined = undefined;
  public assetNumberConfidence: string | undefined = undefined;
  public loadingOverlay: boolean = true;
  public showingOnboardingOverlay: boolean = false;
  public onboardingOverlayText = "";
  public failedAssetCreationAttempts = 0;

  constructor(private location: Location) {
    this.currentAsset = this.router.getCurrentNavigation()?.extras.state?.['data'];
    if(!this.currentAsset || !this.currentAsset.id) {
      this.loadingOverlay = false;
      this.setCurrentState(FileGenerationStates.ASSET_NUMBER_CAPTURE);
    } else if(this.currentAsset.assetNumber === "") {
      if(this.currentAsset.mainImage !== "") {
        this.recognizeAsset();
      }
    } else {
      if(this.isAssetComplete()) {
        this.setCurrentState(FileGenerationStates.SELECTING_NEXT_ACTION);
      } else {
        this.setCurrentState(FileGenerationStates.PHOTO_CAPTURE);
      }
      this.loadingOverlay = false;
    }
  };

  private setCurrentState(value: FileGenerationStates) {
    this.currentState = value;
    this.handleStateChange(value);
  }

  private handleStateChange(state: FileGenerationStates) {
    switch (state) {
      case FileGenerationStates.ASSET_NUMBER_CAPTURE:
        this.verifyOnboardingStep1();
        break;
      case FileGenerationStates.PHOTO_CAPTURE:
        this.verifyOnboardingStep2();
        break;
    }
  }

  private verifyOnboardingStep1() {
    if (!this.onboardingService.hasCompletedStep('step1')) {
      this.showingOnboardingOverlay = true;
      this.onboardingOverlayText = '1º passo: tire foto da etiqueta de patrimônio.';
      this.onboardingService.completeStep('step1');
    }
  }

  private verifyOnboardingStep2() {
    if (!this.onboardingService.hasCompletedStep('step2')) {
      this.showingOnboardingOverlay = true;
      this.onboardingOverlayText = '2º passo: tire mais 2 fotos de ângulos diferentes do bem';
      this.onboardingService.completeStep('step2');
    }
  }

  public getImageCount(): number {
    return this.utilsService.getImageCount(this.currentAsset);
  }

  public isAssetComplete(): boolean {
    return this.utilsService.isAssetComplete(this.currentAsset);
  }

/**----------------------------------------------------------------------------------------------------------- */
  public clearImage(state: FileGenerationStates): void {
    this.webcamImage = null;
    this.setCurrentState(state);
  }

  onImageCaptured(image: WebcamImage): void {
    this.webcamImage = image;
    if(this.currentState==FileGenerationStates.ASSET_NUMBER_CAPTURE) {
      this.setCurrentState(FileGenerationStates.REVIEWING_MAIN_PHOTO);
    } else {
      this.setCurrentState(FileGenerationStates.REVIEWING_ASSET_PHOTO);
    }
  }

  public goBack() {
    this.location.back();
  }

  public continueToAssetPhoto() {
    this.setCurrentState(FileGenerationStates.PHOTO_CAPTURE);
  }

  public createAsset() {
    this.loadingOverlay = true;
    const fileId = this.currentAsset.fileId;
    if(fileId && this.webcamImage?.imageAsDataUrl){
      this.backendService.createAsset(fileId, this.webcamImage.imageAsDataUrl).subscribe({
        next: data => {
          this.currentAsset = {
            id: data.assetId,
            fileId: fileId,
            description: "",
            responsible: "",
            assetNumber: "",
            mainImage: data.mainImage,
            images: []
          }
          if(data.confidenceLevel && (parseFloat(data.confidenceLevel) > 0.5)) {
            console.log('Asset created:', data);
            this.temporaryAssetNumber = data.assetNumber;
            this.assetNumberConfidence = data.confidenceLevel;
            this.setCurrentState(FileGenerationStates.REVIEWING_ASSET_NUMBER);
            this.failedAssetCreationAttempts = 0;
          } else if(this.failedAssetCreationAttempts >= 2) {
            console.log('Asset created but asset number not recognized:', data);
            this.temporaryAssetNumber = '';
            this.assetNumberConfidence = '1';
            this.setCurrentState(FileGenerationStates.REVIEWING_ASSET_NUMBER);
            this.failedAssetCreationAttempts = 0;
          } else {
            this.failedAssetCreationAttempts++;
            this.setCurrentState(FileGenerationStates.ASSET_NUMBER_NOT_FOUND);
          }
          this.loadingOverlay = false;
        },
        error: error => {
          console.error(error);
          if(error.error.detail === BACKEND_FILE_INCOMPLETE_ASSETS) {
            this.setCurrentState(FileGenerationStates.ERROR_FILE_INCOMPLETE_ASSETS);
          } else {
            this.setCurrentState(FileGenerationStates.ERROR_INTERNAL_ERROR);
          }
          this.loadingOverlay = false;
        }
      });
    }
  }

  public deleteAsset() {
    this.loadingOverlay = true;
    const fileId = this.currentAsset.fileId;
    if(this.currentAsset.id){
      this.backendService.deleteAsset(this.currentAsset.id).subscribe({
        next: data => {
          console.log('Asset deleted:', data);
          this.setCurrentState(FileGenerationStates.ASSET_NUMBER_CAPTURE);
          this.currentAsset = {
            id: undefined,
            fileId: fileId,
            description: "",
            responsible: "",
            assetNumber: "",
            mainImage: "",
            images: []
          }
          this.loadingOverlay = false;
        },
        error: error => {
          console.error('Error deleting asset:', error);
          alert("Erro ao deletar bem");
          this.loadingOverlay = false;
        }
      });
    } else {
      this.loadingOverlay = false;
      this.setCurrentState(FileGenerationStates.ASSET_NUMBER_CAPTURE);
    }
  }

  public recognizeAsset() {
    this.loadingOverlay = true;
    this.backendService.recognizeAssetNumber(this.currentAsset.id || 0).subscribe({
      next: data => {
        this.currentAsset = {
          id: data.assetId,
          fileId: data.fileId,
          description: "",
          responsible: "",
          assetNumber: "",
          mainImage: data.mainImage,
          images: []
        }
        if(data.confidenceLevel && (parseFloat(data.confidenceLevel) > 0.5)) {
          console.log('Recognizing asset number:', data);
          this.temporaryAssetNumber = data.assetNumber;
          this.assetNumberConfidence = data.confidenceLevel;
          this.setCurrentState(FileGenerationStates.REVIEWING_ASSET_NUMBER);
        } else {
          this.setCurrentState(FileGenerationStates.ASSET_NUMBER_NOT_FOUND);
        }
        this.loadingOverlay = false;
      },
      error: error => {
        console.error(error);
        this.loadingOverlay = false;
      }
    });
  }

  public confirmAsset() {
    this.loadingOverlay = true;
    if(this.currentAsset.id && this.temporaryAssetNumber){
      this.backendService.confirmAsset(this.currentAsset.id, this.temporaryAssetNumber).subscribe({
        next: data => {
          console.log('Asset confirmed');
          this.currentAsset = {
            id: this.currentAsset.id,
            fileId: this.currentAsset.fileId,
            description: data.description || "",
            responsible: data.responsible || "",
            assetNumber: this.temporaryAssetNumber || "",
            mainImage: this.currentAsset.mainImage,
            images: []
          }
          this.setCurrentState(FileGenerationStates.REVIEWING_ASSET_INFO);
          this.loadingOverlay = false;
        },
        error: error => {
          if(error.error.detail == BACKEND_ASSET_NOT_FOUND) {
            this.setCurrentState(FileGenerationStates.ERROR_ASSET_NOT_FOUND);
          } else if(error.error.detail == BACKEND_ASSET_INVALID_CONDITION) {
            this.setCurrentState(FileGenerationStates.ERROR_ASSET_INVALID_CONDITION);
          } else if(error.error.detail == BACKEND_ASSET_MORE_THAN_ONE_RESPONSIBLE) {
            this.setCurrentState(FileGenerationStates.ERROR_MORE_THAN_ONE_RESPONSIBLE);
          } else if(error.error.detail == BACKEND_ASSET_ALREADY_IN_FILE) {
            this.setCurrentState(FileGenerationStates.ERROR_ASSET_ALREADY_IN_FILE);
          } else {
            alert(error);
          }
          console.error(error);
          this.loadingOverlay = false;
        }
      });
    }
  }

  public addImageToAsset() {
    this.loadingOverlay = true;
    if(this.currentAsset.id && this.webcamImage?.imageAsDataUrl){
      this.backendService.addImageToAsset(this.currentAsset.id, this.webcamImage.imageAsDataUrl).subscribe({
        next: data => {
          console.log('Image added to asset:', data);
          this.currentAsset.images.push(data.path);
          if(this.isAssetComplete()) {
            this.setCurrentState(FileGenerationStates.SELECTING_NEXT_ACTION);
          } else {
            this.setCurrentState(FileGenerationStates.PHOTO_CAPTURE);
          }
          this.loadingOverlay = false;
        },
        error: error => {
          console.error('Error adding image to asset:', error);
          alert("Não foi possível adicionar imagem ao bem");
          this.loadingOverlay = false;
        }
      });
    }
  }

  public confirmFile() {
    this.loadingOverlay = true;
    if(this.currentAsset.fileId && this.isAssetComplete()){
      this.backendService.confirmFile(this.currentAsset.fileId).subscribe({
        next: data => {
          console.log('File confirmed:', data);
          this.router.navigate(['/']);
          this.loadingOverlay = false;
        },
        error: error => {
          if(error.error.detail === BACKEND_FILE_INVALID_ASSETS) {
            this.setCurrentState(FileGenerationStates.ERROR_FILE_INVALID_ASSETS);
          } else {
            alert(error);
          }
          console.error(error);
          this.loadingOverlay = false;
        }
      });
    }
  }

  public resetVariablesForNewAsset() {
    this.setCurrentState(FileGenerationStates.ASSET_NUMBER_CAPTURE);
    this.webcamImage = null;
    this.temporaryAssetNumber = undefined;
    this.assetNumberConfidence = undefined;
    this.currentAsset = {
      id: undefined,
      fileId: this.currentAsset.fileId,
      description: "",
      responsible: "",
      assetNumber: "",
      mainImage: "",
      images: []
    }
  }
}
