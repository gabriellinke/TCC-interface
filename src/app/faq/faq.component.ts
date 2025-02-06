import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-faq',
    imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.css'
})
export class FAQComponent {

}
