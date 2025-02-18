import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil, WebcamModule } from 'ngx-webcam';
import { CommonModule, Location } from '@angular/common';
// Declaração do ImageCapture para que o TypeScript entenda
declare var ImageCapture: any;

@Component({
    selector: 'app-camera',
    imports: [CommonModule, WebcamModule],
    templateUrl: './camera.component.html',
    styleUrl: './camera.component.css'
})
export class CameraComponent implements OnInit {
  @Output() imageCaptured = new EventEmitter<WebcamImage>();  // Emitir o evento com a imagem
  @Input() showSquare: boolean = false;
  @Input() onClose!: () => void;
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

  public webcamImage: WebcamImage | null = null;
  private resizeObserver: ResizeObserver | undefined;

/**----------------------------------------------------------------------------------------------------------- */

  constructor(private location: Location) {};

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

  ngAfterViewInit(): void {
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  setupResizeObserver() {
    const cameraContainer = document.getElementById('camera-container');
    if (cameraContainer) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateCloseButtonPosition();
      });

      const videoElement = cameraContainer.querySelector('video');
      if (videoElement) {
        this.resizeObserver.observe(videoElement);
      }
    }
  }

  public close() {
    this.location.back();
  }

  public updateCloseButtonPosition() {
    const cameraContainer = document.getElementById('camera-container');
    if (cameraContainer) {
      const videoElement = cameraContainer.querySelector('video');
      if (videoElement) {
        const videoRect = videoElement.getBoundingClientRect();
        const closeButton = document.getElementById('close');
        if (closeButton) {
          closeButton.style.top = `${videoRect.top + 16}px`;  // Ajuste a posição conforme necessário
          closeButton.style.right = `${Math.max(videoRect.left, 0) + 16}px`;
        }
      } else {
        console.log('Elemento <video> não encontrado');
      }
    }
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
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS) {
        alert('O modo torch não é suportado no iOS. Ative a lanterna manualmente.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: ['environment'],
        },
      });

      if (mediaStream) {
        const track = mediaStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);

        imageCapture.getPhotoCapabilities().then((capabilities: any) => {
          if (capabilities && capabilities.fillLightMode && (capabilities.fillLightMode.includes('flash') || capabilities.fillLightMode.includes('torch'))) {
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
