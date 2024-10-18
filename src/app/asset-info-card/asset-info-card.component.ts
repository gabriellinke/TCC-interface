// asset-info-card.component.ts
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { AssetInterface } from '../../interfaces/AssetInterface';
import { UtilsService } from '../utils.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-asset-info-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-info-card.component.html',
  styleUrls: ['./asset-info-card.component.css']
})
export class AssetInfoCardComponent {
  @Input() asset!: AssetInterface;
  @Output() assetClicked = new EventEmitter<number>();
  public utilsService: UtilsService = inject(UtilsService);

  // Função chamada quando o card é clicado
  onClick() {
    this.assetClicked.emit(this.asset.id);
  }


}
