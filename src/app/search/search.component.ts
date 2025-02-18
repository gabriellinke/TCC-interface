import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { FormsModule, NgForm } from '@angular/forms';
import { AssetSearchInterface } from './../../interfaces/AssetSearchInterface';
import { BackendService } from '../backend.service';

@Component({
    selector: 'app-search',
    imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})
export class SearchComponent {
  public backendService: BackendService = inject(BackendService);
  public searchType: string = 'tombo';
  public loadingResult: boolean = false;
  public notFound: boolean = false;
  public asset: AssetSearchInterface | undefined = undefined;

  public search(form: NgForm) {
    const searchValue = form.value.searchValue;
    if (!searchValue) {
      console.log('Campo de pesquisa está vazio');
      return;
    }

    this.loadingResult = true;
    this.notFound = false;
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
    this.backendService.searchAssetByAssetNumber(searchValue).subscribe({
      next: data => {
        console.log('Searched asset by assetNumber:', data);
        this.asset = data;
        this.loadingResult = false;
      },
      error: error => {
        console.error(error);
        this.loadingResult = false;
        this.asset = undefined;
        this.notFound = true;
      }
    });
  }

  searchFormerAssetNumber(searchValue: string) {
    this.backendService.searchAssetByFormerAssetNumber(searchValue).subscribe({
      next: data => {
        console.log('Searched asset by formerAssetNumber:', data);
        this.asset = data;
        this.loadingResult = false;
      },
      error: error => {
        console.error(error);
        this.loadingResult = false;
        this.asset = undefined;
        this.notFound = true;
      }
    });
  }
}
