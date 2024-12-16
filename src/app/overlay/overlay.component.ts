import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-overlay',
    imports: [CommonModule],
    templateUrl: './overlay.component.html',
    styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {
  @Input() isVisible: boolean = false;

  closeOverlay() {
    this.isVisible = false;
  }
}
