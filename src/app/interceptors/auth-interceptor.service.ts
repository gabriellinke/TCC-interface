import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private oauthService: OAuthService) {
    console.log("Construindo interceptor");
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verifica se o token está disponível
    console.log("Intercept");
    const token = this.oauthService.getAccessToken();
    console.log(token);
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }
    return next.handle(req); // Se não houver token, apenas prossegue com a requisição original
  }
}
