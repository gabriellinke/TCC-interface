export interface AssetInterfaceSimplified {
  id: number | undefined;
  fileId: number;
  assetNumber: string;
  description: string;
  responsible: string;
  mainImage: string;
  images: string[];
}
