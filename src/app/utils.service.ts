import { Injectable } from '@angular/core';
import { AssetInterface } from '../interfaces/AssetInterface';
import { AssetInterfaceSimplified } from '../interfaces/AssetInterfaceSimplified';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getImageCount(asset: AssetInterface | AssetInterfaceSimplified): number {
    let imageCount = asset.mainImage !== "" ? 1 : 0;
    imageCount += asset.images.length || 0;
    return imageCount;
  }

  isAssetComplete(asset: AssetInterface | AssetInterfaceSimplified): boolean {
    return !!asset && asset.mainImage !== "" && asset.assetNumber !== "" && asset.images.length >= 2;
  }
}
