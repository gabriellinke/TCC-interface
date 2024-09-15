import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil, WebcamModule } from 'ngx-webcam';
import { CommonModule } from '@angular/common';
// Declaração do ImageCapture para que o TypeScript entenda
declare var ImageCapture: any;

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, WebcamModule],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent implements OnInit {
  @Output() imageCaptured = new EventEmitter<WebcamImage>();  // Emitir o evento com a imagem
  @Input() showSquare: boolean = false;
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
  public isTorchOn: boolean | ConstrainBooleanParameters | undefined = false;
  /**----------------------------------------------------------------------------------------------------------- */

  public webcamImage: WebcamImage | null = null;

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
    this.imageCaptured.emit(webcamImage);  // Emitir o valor para o componente pai
    this.turnTorchOff();
  }

  public turnTorchOff(): void {
    this.isTorchOn = true;
    this.onSwitchTorch();
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

  public async onSwitchTorch() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: ['environment'],
        },
      });

      if (mediaStream) {
        const track = mediaStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);

        imageCapture.getPhotoCapabilities().then((capabilities: any) => {
          if (capabilities.fillLightMode.includes('flash') || capabilities.fillLightMode.includes('torch')) {
            this.isTorchOn = !this.isTorchOn;
            track.applyConstraints({
              advanced: [
                {
                  torch: this.isTorchOn,
                } as MediaTrackConstraintSet,
              ],
            }).then();
          }
        });
      }
    } catch (err) {
      console.error('Error enabling torch:', err);
    }
  }

}
