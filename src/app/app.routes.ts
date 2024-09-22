import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FileGenerationComponent } from './file-generation/file-generation.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
      path: '',
      component: HomeComponent,
      canActivate: [authGuard]
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
      canActivate: [authGuard]
  }
];
