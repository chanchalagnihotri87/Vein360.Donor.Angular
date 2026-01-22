import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MessageDisplayService {
  constructor(private readonly toast: ToastrService) {}

  showSuccessMessage(msg: string) {
    this.toast.success(msg);
  }

  showLongSuccessMessage(msg: string) {
    this.toast.success(msg, '', {
      toastClass: 'ngx-toastr wide-toast',
    });
  }

  showGeneralErrorMessage() {
    this.toast.error(
      'Sorry, an error occurred on the server. Please try again later.',
      '',
      {
        toastClass: 'ngx-toastr wide-error-toast',
      },
    );
  }

  showNetworkErrorMessage() {
    this.toast.error(
      `Sorry, we're unable to connect to the server. Please check your internet connection or try again later.`,
      '',
      {
        toastClass: 'ngx-toastr wide-error-toast',
      },
    );
  }

  showErrorMessage(msg: string) {
    this.toast.error(msg, '', {
      toastClass: 'ngx-toastr wide-error-toast',
    });
  }
}
