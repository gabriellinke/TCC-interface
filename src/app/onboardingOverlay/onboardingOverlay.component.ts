import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-onboarding-overlay',
    imports: [CommonModule],
    templateUrl: './onboardingOverlay.component.html',
    styleUrls: ['./onboardingOverlay.component.css']
})
export class OnboardingOverlayComponent {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  closeOverlay() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
}
