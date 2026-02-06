import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
export function TokenInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();

  const headers: { [key: string]: string } = {};

  if (token) {
    headers['Authorization'] = token;
  }

  // if (req.method === 'GET' && !req.url.includes('/show')) {
  //   const locale = localStorage.getItem('app_lang') || 'en';
  //   headers['locale'] = locale;
  // }

  req = req.clone({ setHeaders: headers });
  return next(req).pipe(
    catchError((error) => {
      if (
        error.status === 401 &&
        !req.url.toLocaleLowerCase().includes('logout') &&
        !req.url.toLocaleLowerCase().includes('signin')

      ) {
        auth.logout().subscribe({
          next: () => router.navigate(['/auth']),
          error: () => router.navigate(['/auth']),
        });
      }
      return throwError(() => error);
    }),
  );
}
