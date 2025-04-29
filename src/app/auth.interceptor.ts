import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './login/shared/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  var authService = inject(AuthService);
  debugger;

  if (req.url.indexOf('signin') !== -1) {
    return next(req);
  }

  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.token()}`,
    },
  });
  return next(req);
};
