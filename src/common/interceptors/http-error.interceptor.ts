import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageDisplayService } from '../../app/shared/message-display/message-display.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const msgDisplayService = inject(MessageDisplayService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status == 0) {
        msgDisplayService.showGeneralErrorMessage();
      }
      if (error.status == 500) {
        msgDisplayService.showGeneralErrorMessage();
      }
      return throwError(() => error);
    }),
  );
};
