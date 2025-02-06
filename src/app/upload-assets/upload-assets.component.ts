import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { BackendService } from '../backend.service';
import { OverlayComponent } from '../overlay/overlay.component';

export enum State {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

@Component({
    selector: 'upload',
    imports: [CommonModule, HeaderComponent, FooterComponent, OverlayComponent],
    templateUrl: './upload-assets.component.html',
    styleUrl: './upload-assets.component.css'
})
export class UploadAssetsComponent {
  public backendService: BackendService = inject(BackendService);
  public State = State;
  public selectedFile: File | null = null;
  public state: State = State.PROCESSING;
  public isOverlayOpen: boolean = false;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;
    this.state = State.PROCESSING;
    this.isOverlayOpen = true;
    this.backendService.uploadFile(this.selectedFile).subscribe({
      next: data => {
        this.state = State.SUCCESS;
        console.log("File uploaded successfully", data);
      },
      error: error => {
        this.state = State.ERROR;
        console.log("Failed to upload file", error);
      }
    });
  }

  closeOverlay(): void {
    this.isOverlayOpen = false;
    this.state = State.PROCESSING;
  }
}
