import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig ={
  issuer: 'http://localhost:8001/realms/adjoda-dev-realm',
  tokenEndpoint: 'http://localhost:8001/realms/adjoda-dev-realm/protocol/openid-connect/token',
  redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  clientId: 'adjoda-webapp',
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
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => {
          initializeOAuth(oauthService);
        }
      },
      multi: true,
      deps: [
        OAuthService
      ]
    }
  ]
};
