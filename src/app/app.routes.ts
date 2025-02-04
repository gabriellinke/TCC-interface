import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FileGenerationComponent } from './file-generation/file-generation.component';
import { FileInfoComponent } from './file-info/file-info.component';
import { AssetInfoComponent } from './asset-info/asset-info.component';
import { SearchComponent } from './search/search.component';
import { authGuard } from './auth.guard';
import { UnserviceableAssetsInfoComponent } from './unserviceable-assets-info/unserviceable-assets-info.component';
import { FAQComponent } from './faq/faq.component';
import { ReportsRequestInfoComponent } from './reports-request-info/reports-request-info.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
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
    path: 'details/reportsRequest',
    component: ReportsRequestInfoComponent,
  },
];
