import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-step-by-step-info',
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],

  templateUrl: './step-by-step-info.component.html',
  styleUrl: './step-by-step-info.component.css'
})
export class StepByStepInfoComponent {

}
