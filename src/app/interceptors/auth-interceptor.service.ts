import { HttpHandlerFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  if (req.url.includes('/auth')) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  // TODO: Se não tiver token ou tiver expirado, redireciona para a página de login

  if (token && token !== "") {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  } else {
    return next(req);
  }
}
