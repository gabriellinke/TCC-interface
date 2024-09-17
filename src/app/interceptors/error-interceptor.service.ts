import { HttpHandlerFn, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UNAUTHORIZED_401, FORBIDDEN_403, NOT_FOUND_404, UNKNOWN_ERROR } from '../../constants/constants';

export function errorInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = UNKNOWN_ERROR;

      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // Implementar lógica de logout se necessário
          // Exemplo: this.authService.logout();
          errorMessage = UNAUTHORIZED_401;
          console.log(UNAUTHORIZED_401);
        }
        if(error.error && error.error.detail) {
          errorMessage = error.error.detail;
        }
        if (error.status === 403) {
          errorMessage = FORBIDDEN_403;
        }
        if(error.status === 404) {
          errorMessage = NOT_FOUND_404;
        }
      }
      return throwError(() => new Error(errorMessage));
    })
  );
}
