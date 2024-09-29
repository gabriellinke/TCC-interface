import { Component, Input } from '@angular/core';
import { FileInterface } from './../../interfaces/FileInterface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-card.component.html',
  styleUrl: './download-card.component.css'
})
export class DownloadCardComponent {
  @Input() file!: FileInterface;
}
