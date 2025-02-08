import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-web-app-info',
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './web-app-info.component.html',
  styleUrl: './web-app-info.component.css'
})
export class WebAppInfoComponent {

}
