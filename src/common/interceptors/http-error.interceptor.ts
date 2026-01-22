import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageDisplayService } from '../../app/shared/message-display/message-display.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const msgDisplayService = inject(MessageDisplayService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Error:');
      console.log(error);

      if (error.status == 0) {
        msgDisplayService.showNetworkErrorMessage();
      }

      if (error.status == 409) {
        msgDisplayService.showErrorMessage(error.error.message);
      }

      if (error.status == 500) {
        msgDisplayService.showGeneralErrorMessage();
      }
      return throwError(() => error);
    }),
  );
};
