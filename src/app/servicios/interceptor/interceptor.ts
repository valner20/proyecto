import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const token = localStorage.getItem('access');

  let authReq = req;

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        localStorage.removeItem('access');
        router.navigate(['/login']);
        return throwError(() => new Error('Token expirado'));
      }

      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      localStorage.removeItem('access');
      router.navigate(['/login']);
      return throwError(() => new Error('Token inválido'));
    }
  }

  return next(authReq);
};
