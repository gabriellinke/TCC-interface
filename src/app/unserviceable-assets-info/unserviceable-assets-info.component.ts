import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
    selector: 'app-unserviceable-assets-info',
    imports: [CommonModule, HeaderComponent, FooterComponent],
    templateUrl: './unserviceable-assets-info.component.html',
    styleUrl: './unserviceable-assets-info.component.css'
})
export class UnserviceableAssetsInfoComponent {

}
