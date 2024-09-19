import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebcamImage } from 'ngx-webcam';
import { CommonModule } from '@angular/common';
import { BackendService } from '../backend.service';
import { CameraComponent } from '../camera/camera.component';
import { BAKEND_ASSET_ALREADY_IN_FILE, BAKEND_ASSET_INVALID_CONDITION, BAKEND_ASSET_MORE_THAN_ONE_RESPONSIBLE, BAKEND_ASSET_NOT_FOUND, BAKEND_FILE_INCOMPLETE_ASSETS, BAKEND_FILE_INVALID_ASSETS, BAKEND_USER_ALREADY_HAS_FILE, FORBIDDEN_403 } from '../../constants/constants';
import { FileInterface } from '../../interfaces/FileInterface';
import { Router } from '@angular/router';

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
  public unconsolidatedFileId: number | undefined = undefined;

  constructor() {
    this.backendService.getFiles().subscribe({
      next: data => {
        console.log("Get Files", data);
        this.files = data;
        const unconsolidatedFile = this.files.find(file => file.consolidated === false);
        this.unconsolidatedFileId = unconsolidatedFile?.id;
        console.log(this.unconsolidatedFileId);
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  public handleFileAction() {
    if (this.unconsolidatedFileId === null || this.unconsolidatedFileId === undefined) {
      this.createFile();
    } else {
      this.redirectToPage();
    }
  }

  public redirectToPage() {
    this.router.navigate([`/generate/${this.unconsolidatedFileId}`]);
  }

  public createFile() {
    this.backendService.createFile().subscribe({
      next: data => {
        console.log('File created:', data);
        this.unconsolidatedFileId = data.id;
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
}
