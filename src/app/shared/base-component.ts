import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { BreadcrumbItem } from '../shared/breadcrumb/shared/breadcrumb-item.model';
import { BreadcrumbService } from '../shared/breadcrumb/shared/breadcrumb.service';

export class BaseComponent {
  private breadcrumbService = inject(BreadcrumbService);

  protected setBereadcrumb(breadcrumbs: BreadcrumbItem[]) {
    this.breadcrumbService.breadcrumbs.set(breadcrumbs);
  }

  protected hideButtonTooltip(event: Event) {
    let currentButton = event.currentTarget as HTMLButtonElement;
    currentButton.blur();
  }

  public get productImagePath() {
    return `${environment.apiUrl}/products/image`;
  }
}
