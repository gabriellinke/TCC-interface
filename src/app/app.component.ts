import { Component, OnInit, assertPlatform, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Subject, Observable} from 'rxjs';
import { FormsModule } from '@angular/forms';
import {WebcamImage, WebcamInitError, WebcamUtil, WebcamModule} from 'ngx-webcam';
import { CommonModule } from '@angular/common';
import { BackendService } from './backend.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, WebcamModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public backendService: BackendService = inject(BackendService);
  public screenWidth: number = 0;
  public screenHeight: number = 0;
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = '';
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
    facingMode: { ideal: 'environment' },
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public processedImage: string | null = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();


  /**----------------------------------------------------------------------------------------------------------- */

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

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    // Update screen dimensions on window resize
    window.addEventListener('resize', this.updateScreenDimensions.bind(this));
  }


  public updateScreenDimensions() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public clearImage(numberOfStates: number = 1): void {
    this.webcamImage = null;
    this.processedImage = null;
    this.state = this.state-numberOfStates;
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      alert("NotAllowedError");
      console.warn("Camera access was not allowed by user!");
    } else {
      alert(`Other error: ${error.mediaStreamError.name}`);
    }
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.state = this.state+1;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  public enableAssetNumberUpdate() {
    this.assetNumberUpdateEnabled = true;
  }

  public login(email: string, password: string) {
    this.backendService.login(email, password).subscribe({
      next: data => {
        console.log('Logged in successfully:', data);
        this.state = this.state+1;
      },
      error: error => {
        console.error('Login failed:', error);
      }
    });
  }

  public createFile() {
    this.backendService.createFile().subscribe({
      next: data => {
        console.log('File created:', data);
        this.fileId = data.id;
        this.state = this.state+1;
      },
      error: error => {
        console.error('Error creating file:', error);
      }
    });
  }

  public createAsset() {
    if(this.fileId && this.webcamImage?.imageAsDataUrl){
      this.backendService.createAsset(this.fileId, this.webcamImage.imageAsDataUrl).subscribe({
        next: data => {
          console.log('Asset created:', data);
          this.assetNumber = data.assetNumber;
          this.assetNumberConfidence = data.confidenceLevel;
          this.processedImage = data.mainImage;
          this.assetId = data.assetId;
          this.state = this.state+1;
          this.imageCount = this.imageCount+1;
        },
        error: error => {
          console.error('Error creating asset:', error);
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
          this.imageCount = this.imageCount-1;
        },
        error: error => {
          console.error('Error deleting asset:', error);
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
          console.error('Error confirming asset:', error);
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
          console.error('Error confirming file:', error);
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
}
