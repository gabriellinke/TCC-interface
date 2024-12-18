import { provideAppInitializer, inject, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

export const authCodeFlowConfig: AuthConfig ={
  issuer: environment.keycloakIssuerUri,
  tokenEndpoint: `${environment.keycloakIssuerUri}/protocol/openid-connect/token`,
  redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  clientId: environment.clientId,
  responseType: 'code',
  scope: 'openid profile',
  requireHttps: false,  // Permite HTTP em desenvolvimento
}

function initializeOAuth(oauthService: OAuthService): Promise<void> {
  return new Promise( (resole) => {
    oauthService.configure(authCodeFlowConfig);
    oauthService.setupAutomaticSilentRefresh();
    oauthService.loadDiscoveryDocumentAndLogin().then( () => resole() );
  })
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideOAuthClient(),
    provideAppInitializer(() => {
      const oauthService = inject(OAuthService);
      return initializeOAuth(oauthService);  // Retorna a Promise diretamente
    })
  ]
};
