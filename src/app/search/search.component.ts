import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { FormsModule, NgForm } from '@angular/forms';
import { AssetSearchInterface } from './../../interfaces/AssetSearchInterface';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  public searchType: string = 'tombo';
  public loadingResult: boolean = false;
  public asset: AssetSearchInterface | undefined = undefined;

  public search(form: NgForm) {
    const searchValue = form.value.searchValue;
    if (!searchValue) {
      console.log('Campo de pesquisa está vazio');
      return;
    }

    this.loadingResult = true;
    if (this.searchType === 'tombo') {
      this.searchAssetNumber(searchValue);
    } else if (this.searchType === 'tomboAntigo') {
      this.searchFormerAssetNumber(searchValue);
    }
  }

  public toggleSearchInput(value: string) {
    this.searchType = value;
  }

  searchAssetNumber(searchValue: string) {
    console.log('Pesquisando por Número de Tombo');
    this.loadingResult = false;
    this.asset = {
      assetNumber: '068497',
      formerAssetNumber: '65165441',
      responsible: 'Gabriel Henrique Linke',
      description: 'Notebook Avell'
    }
  }

  searchFormerAssetNumber(searchValue: string) {
    console.log('Pesquisando por Número de Tombo Antigo');
    this.loadingResult = false;
  }
}
