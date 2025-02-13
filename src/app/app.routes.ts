import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { FileGenerationComponent } from './file-generation/file-generation.component';
import { FileInfoComponent } from './file-info/file-info.component';
import { AssetInfoComponent } from './asset-info/asset-info.component';
import { SearchComponent } from './search/search.component';
import { UnserviceableAssetsInfoComponent } from './unserviceable-assets-info/unserviceable-assets-info.component';
import { FAQComponent } from './faq/faq.component';
import { UploadAssetsComponent } from './upload-assets/upload-assets.component';
import { StepByStepInfoComponent } from './step-by-step-info/step-by-step-info.component';
import { WebAppInfoComponent } from './web-app-info/web-app-info.component';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'generate',
    component: FileGenerationComponent,
  },
  {
    path: 'info/:id',
    component: FileInfoComponent,
  },
  {
    path: 'info/:file_id/asset/:asset_id',
    component: AssetInfoComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'details',
    component: InfoComponent,
  },
  {
    path: 'details/userviceableAssets',
    component: UnserviceableAssetsInfoComponent,
  },
  {
    path: 'details/FAQ',
    component: FAQComponent,
  },
  {
    path: 'details/step-by-step',
    component: StepByStepInfoComponent,
  },
  {
    path: 'details/web-app',
    component: WebAppInfoComponent,
  },
  {
    path: 'upload-assets',
    component: UploadAssetsComponent,
    canActivate: [adminGuard]
  },
];
