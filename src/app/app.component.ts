import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Subject, Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil, WebcamModule} from 'ngx-webcam';
import { CommonModule } from '@angular/common';
import { ImageUploadService } from './image-upload.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, WebcamModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public imageUploadService: ImageUploadService = inject(ImageUploadService);
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
  public webcamImage: WebcamImage | null = null;
  public processedImage: string | null = null;
  public number: string | null = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

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

  public clearImage(): void {
    this.webcamImage = null;
    this.processedImage = null;
  }

  public sendImage(): void {
    this.imageUploadService.uploadImage(this.webcamImage?.imageAsDataUrl ?? '').then(res => {
      this.processedImage = res.path;
      this.number = res.number ?? null;
    })
    .catch(err => console.error(err));
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
}
