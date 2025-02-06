import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-info',
    imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
    templateUrl: './info.component.html',
    styleUrl: './info.component.css'
})
export class InfoComponent {

}
